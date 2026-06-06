import { useState } from 'react';
import { Star, Award, ArrowUpDown } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import AIRecommendation from '../components/widgets/AIRecommendation';
import { quotations, getVendorById, formatCurrency, formatDate } from '../data';

export default function QuotationComparison() {
  const [sortBy, setSortBy] = useState('price');
  const rfqQuotes = quotations.filter((q) => q.rfqId === 'RFQ-2024-001');

  const sorted = [...rfqQuotes].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    return 0;
  });

  const lowestPrice = Math.min(...rfqQuotes.map((q) => q.price));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Quotation Comparison"
        subtitle="RFQ-2024-001 — Enterprise Server Infrastructure"
        actions={
          <>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="price">Sort by Price</option>
              <option value="delivery">Sort by Delivery</option>
            </select>
            <Button>Select Winner</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Side-by-Side Comparison" subtitle={`${rfqQuotes.length} quotations received`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-xs font-medium text-foreground-subtle uppercase">Criteria</th>
                    {sorted.map((q) => {
                      const vendor = getVendorById(q.vendorId);
                      return (
                        <th key={q.id} className="text-center py-3 px-4 min-w-[160px]">
                          <p className="font-semibold text-foreground">{vendor?.name}</p>
                          {q.recommended && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-dark bg-emerald-brand/10 px-2 py-0.5 rounded-full">
                              <Award className="w-3 h-3" /> Recommended
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-3 text-foreground-subtle font-medium">Price</td>
                    {sorted.map((q) => (
                      <td key={q.id} className={`py-3 px-4 text-center font-bold ${q.price === lowestPrice ? 'text-emerald-dark bg-emerald-brand/5' : 'text-foreground'}`}>
                        {formatCurrency(q.price)}
                        {q.price === lowestPrice && <span className="block text-[10px] text-emerald-brand font-normal">Lowest</span>}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-3 text-foreground-subtle font-medium">Delivery</td>
                    {sorted.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-center text-foreground">{q.deliveryDays} days</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-3 text-foreground-subtle font-medium">Rating</td>
                    {sorted.map((q) => {
                      const vendor = getVendorById(q.vendorId);
                      return (
                        <td key={q.id} className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-warm fill-amber-warm" />
                            {vendor?.rating}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-3 text-foreground-subtle font-medium">On-Time %</td>
                    {sorted.map((q) => {
                      const vendor = getVendorById(q.vendorId);
                      return <td key={q.id} className="py-3 px-4 text-center">{vendor?.onTimeDelivery}%</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-foreground-subtle font-medium">Notes</td>
                    {sorted.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-center text-xs text-foreground-subtle">{q.notes}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <AIRecommendation />
          <Card>
            <CardHeader title="Comparison Summary" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 rounded-lg bg-emerald-brand/5">
                <span className="text-foreground-muted">Best Price</span>
                <span className="font-medium text-emerald-dark">{formatCurrency(lowestPrice)}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-surface-muted">
                <span className="text-foreground-muted">Price Range</span>
                <span className="font-medium">{formatCurrency(lowestPrice)} — {formatCurrency(Math.max(...rfqQuotes.map((q) => q.price)))}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-surface-muted">
                <span className="text-foreground-muted">Avg. Delivery</span>
                <span className="font-medium">{Math.round(rfqQuotes.reduce((s, q) => s + q.deliveryDays, 0) / rfqQuotes.length)} days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
