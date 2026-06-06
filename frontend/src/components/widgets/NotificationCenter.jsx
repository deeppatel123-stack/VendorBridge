import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { notifications } from '../../data';

const typeIcons = {
  info: { icon: Info, color: 'text-cyan-600 bg-cyan-soft/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-warm bg-amber-warm/10' },
  alert: { icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
  success: { icon: CheckCircle, color: 'text-emerald-brand bg-emerald-brand/10' },
};

export default function NotificationCenter({ compact = false }) {
  const items = compact ? notifications.slice(0, 4) : notifications;

  return (
    <Card>
      <CardHeader
        title="Smart Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread`}
        action={<Bell className="w-4 h-4 text-foreground-subtle" />}
      />
      <div className="space-y-2">
        {items.map((n) => {
          const { icon: Icon, color } = typeIcons[n.type] || typeIcons.info;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-surface-muted ${!n.read ? 'bg-emerald-brand/5' : ''}`}
            >
              <div className={`p-1.5 rounded-lg ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-foreground-subtle mt-0.5 truncate">{n.message}</p>
                <p className="text-xs text-foreground-subtle mt-1">{n.time}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-brand shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
