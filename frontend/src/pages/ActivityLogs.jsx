import { useState } from 'react';
import { Filter, FileText, Users, CheckCircle, DollarSign, Settings } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import AdvancedFilters from '../components/widgets/AdvancedFilters';
import { activityLogs } from '../data';

const typeIcons = {
  rfq: FileText,
  quotation: DollarSign,
  approval: CheckCircle,
  vendor: Users,
  invoice: DollarSign,
  system: Settings,
};

const typeColors = {
  rfq: 'bg-cyan-soft/10 text-cyan-600',
  quotation: 'bg-emerald-brand/10 text-emerald-dark',
  approval: 'bg-amber-warm/10 text-amber-600',
  vendor: 'bg-charcoal/5 text-foreground',
  invoice: 'bg-red-50 text-red-500',
  system: 'bg-surface-muted text-foreground-subtle',
};

const filterOptions = [
  { key: 'type', label: 'Event Type', options: [
    { value: '', label: 'All Types' },
    { value: 'rfq', label: 'RFQ' },
    { value: 'quotation', label: 'Quotation' },
    { value: 'approval', label: 'Approval' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'system', label: 'System' },
  ]},
];

export default function ActivityLogs() {
  const [filters, setFilters] = useState({});

  const filtered = activityLogs.filter((log) => {
    return !filters.type || log.type === filters.type;
  });

  const grouped = filtered.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Activity Logs"
        subtitle="Complete audit trail of procurement events"
        actions={<AdvancedFilters filters={filterOptions} onApply={setFilters} />}
      />

      <Card>
        <CardHeader title="Procurement Timeline" subtitle={`${filtered.length} events`} />
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, logs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-foreground">{date}</span>
                <div className="flex-1 h-px bg-border" />
                <Badge>{logs.length}</Badge>
              </div>
              <div className="relative pl-8 space-y-4">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                {logs.map((log) => {
                  const Icon = typeIcons[log.type] || FileText;
                  return (
                    <div key={log.id} className="relative flex items-start gap-4">
                      <div className={`absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center ${typeColors[log.type]}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 p-3 rounded-lg hover:bg-surface-muted transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{log.user}</span>
                            {' '}{log.action}
                            {' '}<span className="text-emerald-brand font-mono text-xs">{log.target}</span>
                          </p>
                          <span className="text-xs text-foreground-subtle">
                            {new Date(log.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <Badge status={log.type} className="mt-2 !capitalize" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
