import { useState } from 'react';
import { Send, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { rfqs, formatCurrency, formatDate } from '../data';

export default function QuotationSubmit() {
  const rfq = rfqs[0];
  const [form, setForm] = useState({
    unitPrice: '', totalPrice: '', deliveryDays: '', notes: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Submit Quotation"
        subtitle="Respond to an open RFQ with your pricing"
        actions={<Button icon={Send}>Submit Quotation</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Quotation Form" subtitle="Enter your pricing and delivery details" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Unit Price ($)" type="number" value={form.unitPrice} onChange={update('unitPrice')} placeholder="0.00" />
                <Input label="Total Price ($)" type="number" value={form.totalPrice} onChange={update('totalPrice')} placeholder="0.00" />
              </div>
              <Input label="Delivery Timeline (days)" type="number" value={form.deliveryDays} onChange={update('deliveryDays')} placeholder="e.g. 14" />
              <Textarea label="Notes & Terms" value={form.notes} onChange={update('notes')} placeholder="Warranty, installation, payment terms..." />
            </div>
          </Card>

          <Card>
            <CardHeader title="Line Items" subtitle="Breakdown of your quotation" />
            <div className="space-y-3">
              {[
                { item: 'Dell PowerEdge R750 Server', qty: 12, price: 18500 },
                { item: '48-port Network Switch', qty: 6, price: 4200 },
                { item: 'Installation & Setup', qty: 1, price: 15000 },
              ].map((line, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 items-center p-3 rounded-lg bg-surface-muted">
                  <span className="col-span-2 text-sm text-foreground">{line.item}</span>
                  <Input type="number" defaultValue={line.qty} className="!space-y-0" />
                  <Input type="number" defaultValue={line.price} className="!space-y-0" />
                </div>
              ))}
              <Button variant="outline" size="sm">+ Add Line Item</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-cyan-soft/20 bg-cyan-soft/5">
            <CardHeader title="RFQ Details" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-subtle">RFQ ID</span>
                <span className="font-mono text-foreground">{rfq.id}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{rfq.title}</p>
                <p className="text-foreground-subtle mt-1">{rfq.description}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Quantity</span>
                <span className="text-foreground">{rfq.quantity} {rfq.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Deadline</span>
                <span className="text-foreground">{formatDate(rfq.deadline)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-subtle">Budget</span>
                <span className="font-medium text-foreground">{formatCurrency(rfq.budget)}</span>
              </div>
              <Badge status={rfq.status} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Attachments" />
            <div className="space-y-2">
              {['RFQ_Specifications.pdf', 'Technical_Requirements.docx'].map((f) => (
                <div key={f} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-muted text-sm">
                  <FileText className="w-4 h-4 text-foreground-subtle" />
                  <span className="text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
