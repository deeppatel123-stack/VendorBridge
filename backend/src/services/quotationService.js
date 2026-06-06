const { Quotation, RFQ, Vendor } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');
const { createNotification } = require('../helpers/notificationHelper');

const generateQuotationNumber = async () => {
  const count = await Quotation.countDocuments();
  return `QT-${String(count + 1).padStart(3, '0')}`;
};

const getQuotations = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.rfqId) filter.rfq = query.rfqId;
  if (query.status) filter.status = query.status;
  if (user.role === 'vendor' && user.vendorProfile) filter.vendor = user.vendorProfile;

  const [quotations, total] = await Promise.all([
    Quotation.find(filter)
      .populate('rfq', 'rfqNumber title deadline budget')
      .populate('vendor', 'name rating onTimeDelivery vendorCode')
      .sort({ price: 1 })
      .skip(skip).limit(limit),
    Quotation.countDocuments(filter),
  ]);
  return { quotations, pagination: buildPaginationMeta(total, page, limit) };
};

const getQuotationById = async (id) => {
  const q = await Quotation.findOne({ _id: id, isDeleted: false })
    .populate('rfq').populate('vendor').populate('submittedBy', 'name email');
  if (!q) throw new AppError('Quotation not found', 404);
  return q;
};

const submitQuotation = async (data, user) => {
  const rfq = await RFQ.findOne({ _id: data.rfq, isDeleted: false });
  if (!rfq) throw new AppError('RFQ not found', 404);
  if (!['open', 'evaluating'].includes(rfq.status)) throw new AppError('RFQ is not accepting quotations', 400);

  const vendorId = user.vendorProfile || data.vendor;
  if (!vendorId) throw new AppError('Vendor profile required', 400);

  data.quotationNumber = await generateQuotationNumber();
  data.vendor = vendorId;
  data.submittedBy = user._id;
  data.status = 'submitted';
  data.submittedAt = new Date();

  const quotation = await Quotation.create(data);
  rfq.responses = await Quotation.countDocuments({ rfq: rfq._id, status: 'submitted', isDeleted: false });
  await rfq.save();

  await logActivity({ user, action: 'Submitted Quotation', target: quotation.quotationNumber, targetId: quotation._id, type: 'quotation' });
  await createNotification({
    userId: rfq.createdBy,
    title: 'New quotation received',
    message: `Quotation ${quotation.quotationNumber} submitted for ${rfq.rfqNumber}`,
    type: 'info',
  });

  return quotation;
};

const updateQuotation = async (id, data, user) => {
  const quotation = await Quotation.findOne({ _id: id, isDeleted: false, status: { $in: ['draft', 'submitted'] } });
  if (!quotation) throw new AppError('Quotation not found or cannot be edited', 404);
  Object.assign(quotation, data);
  await quotation.save();
  await logActivity({ user, action: 'Updated Quotation', target: quotation.quotationNumber, targetId: quotation._id, type: 'quotation' });
  return quotation;
};

const compareQuotations = async (rfqId) => {
  const quotations = await Quotation.find({ rfq: rfqId, status: 'submitted', isDeleted: false })
    .populate('vendor', 'name rating onTimeDelivery risk vendorCode')
    .sort({ price: 1 });

  if (!quotations.length) throw new AppError('No quotations to compare', 404);

  const lowestPrice = Math.min(...quotations.map((q) => q.price));
  const comparison = quotations.map((q) => ({
    ...q.toObject(),
    isLowestPrice: q.price === lowestPrice,
  }));

  const recommended = quotations.reduce((best, q) => {
    const score = (q.vendor?.rating || 0) * 20 + (q.vendor?.onTimeDelivery || 0) * 0.5 - q.price / 10000;
    const bestScore = (best.vendor?.rating || 0) * 20 + (best.vendor?.onTimeDelivery || 0) * 0.5 - best.price / 10000;
    return score > bestScore ? q : best;
  }, quotations[0]);

  return {
    rfqId,
    quotations: comparison,
    summary: {
      count: quotations.length,
      lowestPrice,
      highestPrice: Math.max(...quotations.map((q) => q.price)),
      avgDelivery: Math.round(quotations.reduce((s, q) => s + q.deliveryDays, 0) / quotations.length),
      recommendedVendorId: recommended.vendor?._id,
      recommendedQuotationId: recommended._id,
    },
  };
};

const selectWinner = async (quotationId, user) => {
  const winner = await getQuotationById(quotationId);
  await Quotation.updateMany({ rfq: winner.rfq, _id: { $ne: quotationId } }, { recommended: false });
  winner.recommended = true;
  winner.status = 'approved';
  await winner.save();
  await Quotation.updateMany({ rfq: winner.rfq, _id: { $ne: quotationId }, status: 'submitted' }, { status: 'rejected' });
  await RFQ.findByIdAndUpdate(winner.rfq, { status: 'evaluating' });
  return winner;
};

module.exports = {
  getQuotations, getQuotationById, submitQuotation, updateQuotation,
  compareQuotations, selectWinner,
};
