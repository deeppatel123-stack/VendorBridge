const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!config.email.host || !config.email.user) {
    console.warn('Email not configured. Set SMTP env variables.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: { user: config.email.user, pass: config.email.pass },
  });
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { mock: true };
  }
  return transport.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
    text: text || subject,
  });
};

const sendPasswordResetEmail = (to, resetUrl) =>
  sendEmail({
    to,
    subject: 'VendorBridge - Password Reset',
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Link expires in 1 hour.</p>`,
  });

const sendRFQInvitation = (to, rfqTitle, rfqNumber) =>
  sendEmail({
    to,
    subject: `New RFQ Invitation: ${rfqNumber}`,
    html: `<p>You have been invited to submit a quotation for <strong>${rfqTitle}</strong> (${rfqNumber}).</p>`,
  });

const sendApprovalRequest = (to, title) =>
  sendEmail({
    to,
    subject: 'Approval Required - VendorBridge',
    html: `<p>An approval request requires your action: <strong>${title}</strong></p>`,
  });

const sendInvoiceEmail = (to, invoiceNumber, total) =>
  sendEmail({
    to,
    subject: `Invoice ${invoiceNumber} - VendorBridge`,
    html: `<p>Invoice <strong>${invoiceNumber}</strong> has been issued. Total: $${total}</p>`,
  });

const sendPONotification = (to, poNumber) =>
  sendEmail({
    to,
    subject: `Purchase Order ${poNumber}`,
    html: `<p>Purchase Order <strong>${poNumber}</strong> has been created.</p>`,
  });

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendRFQInvitation,
  sendApprovalRequest,
  sendInvoiceEmail,
  sendPONotification,
};
