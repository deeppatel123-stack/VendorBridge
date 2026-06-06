import { useState } from 'react';
import { Printer, Download, Mail, Building2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { invoices, purchaseOrders, getVendorById, formatCurrency, formatDate } from '../data';

export default function Invoice() {
  const [selected, setSelected] = useState(invoices[0]);
  const vendor = getVendorById(selected.vendorId);
  const po = purchaseOrders.find((p) => p.id === selected.poId);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Invoices"
        subtitle="Invoice management and history"
        actions={
          <>
            <Button variant="outline" icon={Printer}>Print</Button>
            <Button variant="outline" icon={Download}>Download PDF</Button>
            <Button icon={Mail}>Email Invoice</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Invoice History" />
          <div className="space-y-2">
            {invoices.map((inv) => (
              <button
                key={inv.id}
                onClick={() => setSelected(inv)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selected.id === inv.id ? 'bg-emerald-brand/5 border border-emerald-brand/20' : 'hover:bg-surface-muted'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-sm font-medium text-foreground">{inv.id}</span>
                  <Badge status={inv.status} />
                </div>
                <p className="text-xs text-foreground-subtle mt-1">{getVendorById(inv.vendorId)?.name}</p>
                <p className="text-sm font-medium text-foreground mt-1">{formatCurrency(inv.total)}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="!p-0 overflow-hidden">
            <div className="p-8 border-b border-border bg-gradient-to-r from-charcoal to-charcoal-light text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-6 h-6 text-emerald-brand" />
                    <span className="text-lg font-bold">VendorBridge</span>
                  </div>
                  <p className="text-sm text-foreground-muted">Acme Corporation</p>
                  <p className="text-sm text-foreground-subtle">123 Business Park, Suite 400</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-sm text-foreground-muted mt-1 font-mono">{selected.id}</p>
                  <Badge status={selected.status} className="mt-2 !text-white" />
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xs font-medium text-foreground-subtle uppercase mb-2">Bill To</h4>
                  <p className="font-semibold text-foreground">Acme Corporation</p>
                  <p className="text-sm text-foreground-subtle">Procurement Department</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-foreground-subtle uppercase mb-2">From</h4>
                  <p className="font-semibold text-foreground">{vendor?.name}</p>
                  <p className="text-sm text-foreground-subtle">{vendor?.email}</p>
                  <p className="text-sm text-foreground-subtle">GST: {vendor?.gst}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-lg bg-surface-muted text-sm">
                <div><span className="text-foreground-subtle">PO Reference</span><p className="font-medium">{selected.poId}</p></div>
                <div><span className="text-foreground-subtle">Issued</span><p className="font-medium">{formatDate(selected.issued)}</p></div>
                <div><span className="text-foreground-subtle">Due Date</span><p className="font-medium">{formatDate(selected.due)}</p></div>
              </div>

              {po && (
                <table className="w-full text-sm mb-8">
                  <thead>
                    <tr className="border-b border-border">
                      {['Description', 'Qty', 'Rate', 'Amount'].map((h) => (
                        <th key={h} className="text-left py-2 text-xs text-foreground-subtle uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {po.items.map((item, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-2.5 font-medium">{item.name}</td>
                        <td className="py-2.5">{item.qty}</td>
                        <td className="py-2.5">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 font-medium">{formatCurrency(item.qty * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="flex justify-end">
                <div className="w-56 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-foreground-subtle">Subtotal</span><span>{formatCurrency(selected.amount)}</span></div>
                  <div className="flex justify-between"><span className="text-foreground-subtle">Tax</span><span>{formatCurrency(selected.tax)}</span></div>
                  <div className="flex justify-between pt-2 border-t-2 border-charcoal font-bold text-lg">
                    <span>Total</span><span className="text-emerald-dark">{formatCurrency(selected.total)}</span>
                  </div>
                </div>
              </div>

              {selected.paid && (
                <div className="mt-6 p-3 rounded-lg bg-emerald-brand/5 text-sm text-emerald-dark text-center">
                  Paid on {formatDate(selected.paid)}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
