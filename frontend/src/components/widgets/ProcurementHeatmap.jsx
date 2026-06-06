import Card, { CardHeader } from '../ui/Card';
import { heatmapData } from '../../data';

function getIntensity(value) {
  if (value === 0) return 'bg-surface-muted';
  if (value <= 3) return 'bg-emerald-brand/20';
  if (value <= 7) return 'bg-emerald-brand/40';
  if (value <= 11) return 'bg-emerald-brand/60';
  return 'bg-emerald-brand/90';
}

export default function ProcurementHeatmap() {
  const hours = ['9am', '10', '11', '12', '1pm', '2', '3'];

  return (
    <Card>
      <CardHeader title="Procurement Activity Heatmap" subtitle="Weekly activity by hour" />
      <div className="overflow-x-auto">
        <div className="min-w-[280px]">
          <div className="flex gap-1 mb-1 ml-10">
            {hours.map((h) => (
              <span key={h} className="flex-1 text-center text-[10px] text-foreground-subtle">{h}</span>
            ))}
          </div>
          {heatmapData.map((row) => (
            <div key={row.day} className="flex items-center gap-1 mb-1">
              <span className="w-8 text-xs text-foreground-subtle">{row.day}</span>
              {row.hours.map((val, i) => (
                <div
                  key={i}
                  className={`flex-1 h-6 rounded ${getIntensity(val)} transition-colors hover:ring-2 hover:ring-emerald-brand/30`}
                  title={`${val} activities`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
