import { PiggyBank, ArrowDownRight } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { formatCurrency, kpiData } from '../../data';

export default function CostSavings() {
  return (
    <Card className="bg-gradient-to-br from-amber-warm/5 to-emerald-brand/5">
      <CardHeader title="Cost Saving Insights" subtitle="This month vs. market average" />
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(kpiData.costSavings)}</p>
          <p className="text-sm text-foreground-subtle mt-1">Total savings achieved</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-dark bg-emerald-brand/10 px-3 py-1.5 rounded-lg">
          <ArrowDownRight className="w-4 h-4" />
          <span className="text-sm font-semibold">{kpiData.costSavingsPercent}%</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-foreground-subtle">
        <PiggyBank className="w-4 h-4 text-amber-warm" />
        <span>Smart negotiation saved {formatCurrency(12000)} on IT procurement</span>
      </div>
    </Card>
  );
}
