import { useParams, Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, FileText, Download, TrendingUp } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RiskIndicator from '../components/widgets/RiskIndicator';
import { getVendorById, quotations, purchaseOrders, rfqs, formatCurrency, formatDate } from '../data';

export default function VendorDetails() {
  const { id } = useParams();
  const vendor = getVendorById(id);

  if (!vendor) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-foreground-subtle">Vendor not found</p>
        <Link to="/vendors" className="text-emerald-brand text-sm mt-2 inline-block">Back to vendors</Link>
      </div>
    );
  }

  const vendorQuotes = quotations.filter((q) => q.vendorId === vendor.id);
  const vendorPOs = purchaseOrders.filter((p) => p.vendorId === vendor.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={vendor.name}
        breadcrumbs={<Link to="/vendors" className="text-emerald-brand hover:underline">Vendors</Link>}
        subtitle={`${vendor.category} · Joined ${formatDate(vendor.joined)}`}
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
                <p className="text-sm text-foreground-subtle">{vendor.id} · GST: {vendor.gst}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: vendor.totalOrders },
              { label: 'On-Time Delivery', value: `${vendor.onTimeDelivery}%` },
              { label: 'Total Spend', value: formatCurrency(vendor.spend) },
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
              {vendorQuotes.map((q) => {
                const rfq = rfqs.find((r) => r.id === q.rfqId);
                return (
                  <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-muted">
                    <div>
                      <p className="text-sm font-medium text-foreground">{rfq?.title || q.rfqId}</p>
                      <p className="text-xs text-foreground-subtle">{formatCurrency(q.price)} · {q.deliveryDays} days delivery</p>
                    </div>
                    <Badge status={q.status} />
                  </div>
                );
              })}
              {vendorQuotes.length === 0 && <p className="text-sm text-foreground-subtle text-center py-4">No quotations yet</p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="Procurement History" />
            <div className="space-y-3">
              {vendorPOs.map((po) => (
                <div key={po.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{po.id}</p>
                    <p className="text-xs text-foreground-subtle">Created {formatDate(po.created)}</p>
                  </div>
                  <Badge status={po.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Contact Details" />
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-foreground-muted"><Mail className="w-4 h-4 text-foreground-subtle" />{vendor.email}</p>
              <p className="flex items-center gap-2 text-foreground-muted"><Phone className="w-4 h-4 text-foreground-subtle" />{vendor.phone}</p>
              <p className="flex items-start gap-2 text-foreground-muted"><MapPin className="w-4 h-4 text-foreground-subtle mt-0.5" />{vendor.address}</p>
              <p className="text-foreground-subtle">Contact: <span className="text-foreground font-medium">{vendor.contactPerson}</span></p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Performance Metrics" />
            <div className="space-y-4">
              {[
                { label: 'Delivery Score', value: vendor.onTimeDelivery },
                { label: 'Quality Score', value: Math.round(vendor.rating * 20) },
                { label: 'Cost Efficiency', value: 85 },
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
              Performance trending up
            </div>
          </Card>

          <Card>
            <CardHeader title="Documents" />
            <div className="space-y-2">
              {['GST Certificate.pdf', 'ISO 9001 Certificate.pdf', 'Vendor Agreement.pdf'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-foreground-subtle" />
                    <span className="text-sm text-foreground">{doc}</span>
                  </div>
                  <Button size="sm" variant="ghost"><Download className="w-3.5 h-3.5" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
