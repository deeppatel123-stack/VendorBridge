import { Calendar, FileText, Users, Clock, Shield } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { procurementCalendar } from '../../data';

const typeConfig = {
  review: { icon: FileText, color: 'bg-cyan-soft/10 text-cyan-600' },
  meeting: { icon: Users, color: 'bg-emerald-brand/10 text-emerald-dark' },
  audit: { icon: Shield, color: 'bg-amber-warm/10 text-amber-600' },
  deadline: { icon: Clock, color: 'bg-red-50 text-red-500' },
  contract: { icon: Calendar, color: 'bg-charcoal/5 text-foreground' },
};

export default function ProcurementCalendar() {
  return (
    <Card>
      <CardHeader title="Procurement Calendar" subtitle="Upcoming events" />
      <div className="space-y-3">
        {procurementCalendar.map((event, i) => {
          const { icon: Icon, color } = typeConfig[event.type] || typeConfig.review;
          const date = new Date(event.date);
          return (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-muted transition-colors">
              <div className="text-center w-12 shrink-0">
                <p className="text-xs text-foreground-subtle uppercase">{date.toLocaleDateString('en', { month: 'short' })}</p>
                <p className="text-lg font-bold text-foreground leading-none">{date.getDate()}</p>
              </div>
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-foreground flex-1">{event.title}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
