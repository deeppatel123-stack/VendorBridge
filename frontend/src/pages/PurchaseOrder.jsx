import { useState } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { purchaseOrders, getVendorById, formatCurrency, formatDate } from '../data';

const statusSteps = ['Created', 'Approved', 'In Transit', 'Delivered'];

export default function PurchaseOrder() {
  const [selected, setSelected] = useState(purchaseOrders[0]);
  const vendor = getVendorById(selected.vendorId);

  const subtotal = selected.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const taxTotal = selected.items.reduce((s, i) => s + (i.qty * i.unitPrice * i.tax) / 100, 0);
  const grandTotal = subtotal + taxTotal;

  const statusIndex = { pending: 0, approved: 1, in_transit: 2, delivered: 3 }[selected.status] ?? 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Purchase Orders"
        subtitle="Auto-generated PO management"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {purchaseOrders.map((po) => (
            <Card
              key={po.id}
              hover
              className={`cursor-pointer ${selected.id === po.id ? 'ring-2 ring-emerald-brand/30' : ''}`}
              onClick={() => setSelected(po)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm font-medium text-foreground">{po.id}</span>
                <Badge status={po.status} />
              </div>
              <p className="text-sm text-foreground-subtle">{getVendorById(po.vendorId)?.name}</p>
              <p className="text-xs text-foreground-subtle mt-2">{formatDate(po.created)}</p>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selected.id}</h2>
                <p className="text-sm text-foreground-subtle mt-1">Auto-generated Purchase Order</p>
              </div>
              <Badge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-xs font-medium text-foreground-subtle uppercase mb-2">Vendor</h4>
                <p className="font-semibold text-foreground">{vendor?.name}</p>
                <p className="text-sm text-foreground-subtle">{vendor?.email}</p>
                <p className="text-sm text-foreground-subtle">{vendor?.address}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foreground-subtle uppercase mb-2">Details</h4>
                <p className="text-sm"><span className="text-foreground-subtle">Created:</span> {formatDate(selected.created)}</p>
                <p className="text-sm"><span className="text-foreground-subtle">Delivery:</span> {formatDate(selected.deliveryDate)}</p>
                <p className="text-sm"><span className="text-foreground-subtle">Approved by:</span> {selected.approvedBy || 'Pending'}</p>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-foreground mb-3">Item Breakdown</h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Item', 'Qty', 'Unit Price', 'Tax', 'Total'].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs text-foreground-subtle uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((item, i) => {
                    const lineTotal = item.qty * item.unitPrice;
                    return (
                      <tr key={i} className="border-b border-border">
                        <td className="py-2.5 px-3 font-medium text-foreground">{item.name}</td>
                        <td className="py-2.5 px-3">{item.qty}</td>
                        <td className="py-2.5 px-3">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 px-3">{item.tax}%</td>
                        <td className="py-2.5 px-3 font-medium">{formatCurrency(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-foreground-subtle">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-foreground-subtle">Tax</span><span>{formatCurrency(taxTotal)}</span></div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-base">
                  <span>Grand Total</span><span className="text-emerald-dark">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-4">Status Tracking</h4>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const icons = [Package, CheckCircle, Truck, CheckCircle];
                  const Icon = icons[i];
                  const isComplete = i <= statusIndex;
                  return (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isComplete ? 'bg-emerald-brand text-white' : 'bg-surface-muted text-foreground-subtle'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs mt-2 ${isComplete ? 'text-foreground font-medium' : 'text-foreground-subtle'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
