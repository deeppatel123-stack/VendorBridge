import { FileText, Users, CheckCircle, DollarSign, Settings } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { activityLogs } from '../../data';

const typeIcons = {
  rfq: FileText,
  quotation: DollarSign,
  approval: CheckCircle,
  vendor: Users,
  invoice: DollarSign,
  system: Settings,
};

export default function ActivityFeed({ limit = 6 }) {
  const items = activityLogs.slice(0, limit);

  return (
    <Card>
      <CardHeader title="Recent Activity" subtitle="Live procurement events" />
      <div className="space-y-1">
        {items.map((log) => {
          const Icon = typeIcons[log.type] || FileText;
          return (
            <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-muted transition-colors">
              <div className="p-1.5 rounded-lg bg-surface-muted shrink-0">
                <Icon className="w-3.5 h-3.5 text-foreground-subtle" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{log.user}</span>
                  {' '}{log.action}
                </p>
                <p className="text-xs text-foreground-subtle mt-0.5">{log.target}</p>
              </div>
              <span className="text-[10px] text-foreground-subtle shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
