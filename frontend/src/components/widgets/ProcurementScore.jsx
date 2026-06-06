import { Activity } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { useChartTheme } from '../../utils/chartTheme';
import { kpiData } from '../../data';

export default function ProcurementScore({ score = kpiData.procurementHealth }) {
  const chart = useChartTheme();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention';

  return (
    <Card>
      <CardHeader title="Procurement Health Score" subtitle="Overall system performance" />
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke={chart.grid} strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={chart.colors.emerald} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{score}</span>
            <span className="text-xs text-foreground-subtle">/ 100</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-brand" />
            <span className="text-sm font-medium text-emerald-dark dark:text-emerald-brand">{label}</span>
          </div>
          {[
            { label: 'Vendor Compliance', value: kpiData.vendorCompliance },
            { label: 'On-Time Delivery', value: kpiData.onTimeDelivery },
            { label: 'RFQ Response Rate', value: kpiData.rfqResponseRate },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground-subtle">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}%</span>
              </div>
              <div className="h-1.5 bg-surface-inset rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-brand rounded-full transition-all duration-700"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
