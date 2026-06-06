import { Clock, Users, TrendingUp, Target } from 'lucide-react';
import { kpiData } from '../../data';

const kpis = [
  { label: 'Avg. Approval Time', value: kpiData.avgApprovalTime, icon: Clock, color: 'cyan' },
  { label: 'Active Vendors', value: kpiData.activeVendors, icon: Users, color: 'emerald' },
  { label: 'Cost Savings', value: `${kpiData.costSavingsPercent}%`, icon: TrendingUp, color: 'amber' },
  { label: 'Compliance Rate', value: `${kpiData.vendorCompliance}%`, icon: Target, color: 'charcoal' },
];

const colors = {
  cyan: 'bg-cyan-soft/10 text-cyan-600',
  emerald: 'bg-emerald-brand/10 text-emerald-brand',
  amber: 'bg-amber-warm/10 text-amber-600',
  charcoal: 'bg-charcoal/5 text-foreground',
};

export default function KPIDashboard() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-xl border border-border/80 bg-surface-elevated p-4 card-hover">
          <div className={`inline-flex p-2 rounded-lg ${colors[kpi.color]} mb-3`}>
            <kpi.icon className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          <p className="text-xs text-foreground-subtle mt-1">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
