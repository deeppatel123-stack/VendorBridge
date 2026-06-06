import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, Send } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { vendors } from '../data';

const categoryOptions = [
  { value: 'IT Equipment', label: 'IT Equipment' },
  { value: 'Raw Materials', label: 'Raw Materials' },
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Manufacturing', label: 'Manufacturing' },
];

export default function RFQCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', quantity: '', unit: 'units',
    category: 'IT Equipment', deadline: '', budget: '',
  });
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [attachments, setAttachments] = useState(['specifications.pdf']);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggleVendor = (id) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create RFQ"
        subtitle="Request for Quotation — invite vendors to bid"
        actions={
          <>
            <Button variant="outline" icon={Save}>Save Draft</Button>
            <Button icon={Send} onClick={() => navigate('/rfq')}>Publish RFQ</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-foreground mb-4">RFQ Details</h3>
            <div className="space-y-4">
              <Input label="RFQ Title" value={form.title} onChange={update('title')} placeholder="e.g. Enterprise Server Infrastructure" />
              <Textarea label="Product / Service Details" value={form.description} onChange={update('description')} placeholder="Describe requirements in detail..." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" value={form.quantity} onChange={update('quantity')} placeholder="0" />
                <Input label="Unit" value={form.unit} onChange={update('unit')} placeholder="units, kg, licenses..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" options={categoryOptions} value={form.category} onChange={update('category')} />
                <Input label="Estimated Budget ($)" type="number" value={form.budget} onChange={update('budget')} placeholder="0" />
              </div>
              <Input label="Response Deadline" type="date" value={form.deadline} onChange={update('deadline')} />
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-foreground mb-4">Attachments</h3>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-emerald-brand/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-foreground-subtle mx-auto mb-2" />
              <p className="text-sm text-foreground-subtle">Drag & drop files or <span className="text-emerald-brand font-medium">browse</span></p>
              <p className="text-xs text-foreground-subtle mt-1">PDF, DOC, XLS up to 10MB</p>
            </div>
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file) => (
                  <div key={file} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted">
                    <span className="text-sm text-foreground">{file}</span>
                    <button onClick={() => setAttachments(attachments.filter((f) => f !== file))} className="p-1 hover:bg-surface-inset rounded">
                      <X className="w-3.5 h-3.5 text-foreground-subtle" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h3 className="text-base font-semibold text-foreground mb-4">Select Vendors</h3>
          <p className="text-xs text-foreground-subtle mb-4">Choose vendors to invite for this RFQ</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {vendors.filter((v) => v.status === 'active').map((vendor) => (
              <label
                key={vendor.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedVendors.includes(vendor.id)
                    ? 'border-emerald-brand bg-emerald-brand/5'
                    : 'border-border hover:border-border-strong'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => toggleVendor(vendor.id)}
                  className="rounded text-emerald-brand focus:ring-emerald-brand/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{vendor.name}</p>
                  <p className="text-xs text-foreground-subtle">{vendor.category}</p>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-foreground-subtle mt-3">{selectedVendors.length} vendors selected</p>
        </Card>
      </div>
    </div>
  );
}
