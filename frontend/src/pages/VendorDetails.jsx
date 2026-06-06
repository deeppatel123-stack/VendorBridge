import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Mail, Phone, MapPin, FileText, Download, TrendingUp } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RiskIndicator from '../components/widgets/RiskIndicator';
import { LoadingState, ErrorState } from '../components/ui/DataState';
import { formatCurrency, formatDate, entityId } from '../utils/formatters';
import { vendorsApi } from '../api/vendors';
import { quotationsApi } from '../api/quotations';
import { purchaseOrdersApi } from '../api/purchaseOrders';
import { queryKeys } from '../api/queryKeys';

export default function VendorDetails() {
  const { id } = useParams();

  const { data: vendor, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.vendor(id),
    queryFn: () => vendorsApi.get(id),
  });

  const { data: quotesData } = useQuery({
    queryKey: queryKeys.quotations({ vendor: id, limit: 10 }),
    queryFn: () => quotationsApi.list({ limit: 50 }),
    enabled: !!id,
  });

  const { data: posData } = useQuery({
    queryKey: queryKeys.purchaseOrders({ limit: 50 }),
    queryFn: () => purchaseOrdersApi.list({ limit: 50 }),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState message="Loading vendor..." />;
  if (isError || !vendor) {
    return (
      <div className="text-center py-20">
        <ErrorState message={error?.response?.data?.message || 'Vendor not found'} onRetry={refetch} />
        <Link to="/vendors" className="text-emerald-brand text-sm mt-4 inline-block">Back to vendors</Link>
      </div>
    );
  }

  const vendorQuotes = (quotesData?.items || []).filter(
    (q) => entityId(q.vendor) === id || q.vendor?._id === id
  );
  const vendorPOs = (posData?.items || []).filter(
    (po) => entityId(po.vendor) === id || po.vendor?._id === id
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={vendor.name}
        breadcrumbs={<Link to="/vendors" className="text-emerald-brand hover:underline">Vendors</Link>}
        subtitle={`${vendor.category} · Joined ${formatDate(vendor.createdAt)}`}
        actions={
          <>
            <Button variant="outline">Edit Vendor</Button>
            <Button>Create RFQ</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-xl bg-emerald-brand/10 text-emerald-dark flex items-center justify-center text-xl font-bold">
                {vendor.name.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge status={vendor.status} />
                  <RiskIndicator risk={vendor.risk} />
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                    {vendor.rating} rating
                  </span>
                </div>
                <p className="text-sm text-foreground-subtle">{vendor.vendorCode}{vendor.gst ? ` · GST: ${vendor.gst}` : ''}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: vendor.totalOrders ?? vendorPOs.length },
              { label: 'On-Time Delivery', value: `${vendor.onTimeDelivery}%` },
              { label: 'Total Spend', value: formatCurrency(vendor.spend || vendor.totalSpend) },
              { label: 'Quotations', value: vendorQuotes.length },
            ].map((m) => (
              <Card key={m.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-foreground-subtle mt-1">{m.label}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader title="Recent Quotations" />
            <div className="space-y-3">
              {vendorQuotes.map((q) => (
                <div key={entityId(q)} className="flex items-center justify-between p-3 rounded-lg bg-surface-muted">
                  <div>
                    <p className="text-sm font-medium text-foreground">{q.rfq?.title || q.quotationNumber}</p>
                    <p className="text-xs text-foreground-subtle">{formatCurrency(q.price)} · {q.deliveryDays} days delivery</p>
                  </div>
                  <Badge status={q.status} />
                </div>
              ))}
              {vendorQuotes.length === 0 && <p className="text-sm text-foreground-subtle text-center py-4">No quotations yet</p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="Procurement History" />
            <div className="space-y-3">
              {vendorPOs.map((po) => (
                <div key={entityId(po)} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{po.poNumber}</p>
                    <p className="text-xs text-foreground-subtle">Created {formatDate(po.createdAt)}</p>
                  </div>
                  <Badge status={po.status} />
                </div>
              ))}
              {vendorPOs.length === 0 && <p className="text-sm text-foreground-subtle text-center py-4">No purchase orders yet</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Contact Details" />
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-foreground-muted"><Mail className="w-4 h-4 text-foreground-subtle" />{vendor.email}</p>
              {vendor.phone && <p className="flex items-center gap-2 text-foreground-muted"><Phone className="w-4 h-4 text-foreground-subtle" />{vendor.phone}</p>}
              {vendor.address && <p className="flex items-start gap-2 text-foreground-muted"><MapPin className="w-4 h-4 text-foreground-subtle mt-0.5" />{vendor.address}</p>}
              {vendor.contactPerson && <p className="text-foreground-subtle">Contact: <span className="text-foreground font-medium">{vendor.contactPerson}</span></p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="Performance Metrics" />
            <div className="space-y-4">
              {[
                { label: 'Delivery Score', value: vendor.onTimeDelivery },
                { label: 'Quality Score', value: Math.round(vendor.rating * 20) },
                { label: 'Cost Efficiency', value: Math.min(95, Math.round(100 - (vendor.risk === 'high' ? 18 : vendor.risk === 'medium' ? 10 : 5))) },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground-subtle">{m.label}</span>
                    <span className="font-medium text-foreground">{m.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-brand rounded-full" style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-dark">
              <TrendingUp className="w-4 h-4" />
              Performance from live data
            </div>
          </Card>

          {vendor.documents?.length > 0 && (
            <Card>
              <CardHeader title="Documents" />
              <div className="space-y-2">
                {vendor.documents.map((doc) => (
                  <div key={doc._id || doc.fileName} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-foreground-subtle" />
                      <span className="text-sm text-foreground">{doc.originalName || doc.fileName}</span>
                    </div>
                    <Button size="sm" variant="ghost"><Download className="w-3.5 h-3.5" /></Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
