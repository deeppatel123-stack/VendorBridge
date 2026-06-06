import { Sparkles, Star, TrendingUp } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { getVendorById, formatCurrency } from '../../data';

export default function AIRecommendation({ vendorId = 'V006', savings = 23000 }) {
  const vendor = getVendorById(vendorId);
  if (!vendor) return null;

  return (
    <Card className="border-emerald-brand/20 bg-gradient-to-br from-emerald-brand/5 to-cyan-soft/5">
      <CardHeader
        title="AI Vendor Recommendation"
        subtitle="Based on price, delivery & performance"
        action={
          <div className="flex items-center gap-1 text-emerald-brand">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">AI Powered</span>
          </div>
        }
      />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-brand text-white flex items-center justify-center font-bold text-sm">
          {vendor.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{vendor.name}</h4>
            <Badge status="low">Low Risk</Badge>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-foreground-subtle">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-warm fill-amber-warm" />
              {vendor.rating}
            </span>
            <span>{vendor.onTimeDelivery}% on-time</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-brand" />
            <span className="text-emerald-dark font-medium">
              Save {formatCurrency(savings)} vs. average
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
