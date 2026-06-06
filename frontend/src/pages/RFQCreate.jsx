import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, X, Save, Send } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { LoadingState } from '../components/ui/DataState';
import { entityId } from '../utils/formatters';
import { vendorsApi } from '../api/vendors';
import { rfqsApi } from '../api/rfqs';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

const categoryOptions = [
  { value: 'IT Equipment', label: 'IT Equipment' },
  { value: 'Raw Materials', label: 'Raw Materials' },
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Manufacturing', label: 'Manufacturing' },
];

export default function RFQCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({
    title: '', description: '', quantity: '', unit: 'units',
    category: 'IT Equipment', deadline: '', budget: '',
  });
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const { data: vendorData, isLoading: vendorsLoading } = useQuery({
    queryKey: queryKeys.vendors({ status: 'active', limit: 100 }),
    queryFn: () => vendorsApi.list({ status: 'active', limit: 100 }),
  });

  const vendors = vendorData?.items || [];

  const createMutation = useMutation({
    mutationFn: (body) => rfqsApi.create(body),
    onSuccess: async (data) => {
      const id = entityId(data?.rfq || data);
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      return id;
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to create RFQ'),
  });

  const publishMutation = useMutation({
    mutationFn: (id) => rfqsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      success('RFQ published successfully');
      navigate('/rfq');
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to publish RFQ'),
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggleVendor = (id) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const buildPayload = (status) => ({
    title: form.title,
    description: form.description,
    quantity: Number(form.quantity),
    unit: form.unit,
    category: form.category,
    budget: Number(form.budget) || 0,
    deadline: new Date(form.deadline).toISOString(),
    vendors: selectedVendors,
    status,
  });

  const handleSaveDraft = async () => {
    try {
      const result = await createMutation.mutateAsync(buildPayload('draft'));
      const id = entityId(result?.rfq || result);
      if (selectedVendors.length) await rfqsApi.assignVendors(id, selectedVendors);
      success('Draft saved');
      navigate('/rfq');
    } catch {
      /* handled in mutation */
    }
  };

  const handlePublish = async () => {
    try {
      const result = await createMutation.mutateAsync(buildPayload('draft'));
      const id = entityId(result?.rfq || result);
      if (selectedVendors.length) await rfqsApi.assignVendors(id, selectedVendors);
      await publishMutation.mutateAsync(id);
    } catch {
      /* handled in mutation */
    }
  };

  const isSaving = createMutation.isPending || publishMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create RFQ"
        subtitle="Request for Quotation — invite vendors to bid"
        actions={
          <>
            <Button variant="outline" icon={Save} onClick={handleSaveDraft} disabled={isSaving}>Save Draft</Button>
            <Button icon={Send} onClick={handlePublish} disabled={isSaving || !form.title || !form.quantity || !form.deadline}>
              {isSaving ? 'Saving...' : 'Publish RFQ'}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-foreground mb-4">RFQ Details</h3>
            <div className="space-y-4">
              <Input label="RFQ Title" value={form.title} onChange={update('title')} placeholder="e.g. Enterprise Server Infrastructure" required />
              <Textarea label="Product / Service Details" value={form.description} onChange={update('description')} placeholder="Describe requirements in detail..." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" value={form.quantity} onChange={update('quantity')} placeholder="0" required />
                <Input label="Unit" value={form.unit} onChange={update('unit')} placeholder="units, kg, licenses..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" options={categoryOptions} value={form.category} onChange={update('category')} />
                <Input label="Estimated Budget ($)" type="number" value={form.budget} onChange={update('budget')} placeholder="0" />
              </div>
              <Input label="Response Deadline" type="date" value={form.deadline} onChange={update('deadline')} required />
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
                    <button type="button" onClick={() => setAttachments(attachments.filter((f) => f !== file))} className="p-1 hover:bg-surface-inset rounded">
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
          {vendorsLoading ? <LoadingState message="Loading vendors..." /> : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vendors.map((vendor) => {
                const vid = entityId(vendor);
                return (
                  <label
                    key={vid}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedVendors.includes(vid)
                        ? 'border-emerald-brand bg-emerald-brand/5'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vid)}
                      onChange={() => toggleVendor(vid)}
                      className="rounded text-emerald-brand focus:ring-emerald-brand/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{vendor.name}</p>
                      <p className="text-xs text-foreground-subtle">{vendor.category}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
          <p className="text-xs text-foreground-subtle mt-3">{selectedVendors.length} vendors selected</p>
        </Card>
      </div>
    </div>
  );
}
