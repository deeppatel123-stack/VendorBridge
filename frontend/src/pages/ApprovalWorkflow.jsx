import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import WorkflowVisualization from '../components/widgets/WorkflowVisualization';
import { approvals, formatCurrency, formatDate } from '../data';

export default function ApprovalWorkflow() {
  const [selected, setSelected] = useState(approvals[0]);
  const [comment, setComment] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Approval Workflow"
        subtitle={`${approvals.filter((a) => a.status === 'pending').length} pending approvals`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {approvals.map((approval) => (
            <Card
              key={approval.id}
              hover
              className={`cursor-pointer ${selected?.id === approval.id ? 'ring-2 ring-emerald-brand/30 border-emerald-brand/30' : ''}`}
              onClick={() => setSelected(approval)}
            >
              <div className="flex items-start justify-between mb-2">
                <Badge status={approval.status} />
                <span className="text-[10px] text-foreground-subtle font-mono">{approval.id}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground">{approval.title}</h4>
              <div className="flex items-center justify-between mt-3 text-xs text-foreground-subtle">
                <span>{approval.requester}</span>
                {approval.amount > 0 && <span className="font-medium text-foreground">{formatCurrency(approval.amount)}</span>}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-brand rounded-full transition-all"
                    style={{ width: `${(approval.currentStep / approval.totalSteps) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-foreground-subtle">{approval.currentStep}/{approval.totalSteps}</span>
              </div>
            </Card>
          ))}
        </div>

        {selected && (
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader
                title={selected.title}
                subtitle={`Requested by ${selected.requester} on ${formatDate(selected.created)}`}
              />
              <div className="flex gap-3 mb-6">
                <Button icon={CheckCircle} className="flex-1">Approve</Button>
                <Button variant="danger" icon={XCircle} className="flex-1">Reject</Button>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your approval comments..."
                />
              </div>
            </Card>

            <WorkflowVisualization steps={selected.steps} />

            <Card>
              <CardHeader title="Status Progression" />
              <div className="flex items-center justify-between">
                {['Submitted', 'Under Review', 'Approved'].map((step, i) => {
                  const isActive = i < selected.currentStep;
                  const isCurrent = i === selected.currentStep - 1;
                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div className={`absolute top-4 right-1/2 w-full h-0.5 ${isActive ? 'bg-emerald-brand' : 'bg-surface-inset'}`} style={{ transform: 'translateX(-50%)' }} />
                      )}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-emerald-brand text-white' : isCurrent ? 'bg-amber-warm text-white' : 'bg-surface-inset text-foreground-subtle'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-xs text-foreground-subtle mt-2">{step}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
