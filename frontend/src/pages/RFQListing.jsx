import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LayoutGrid, List, Calendar, Users } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card, { CardHeader } from '../components/ui/Card';
import AdvancedFilters from '../components/widgets/AdvancedFilters';
import { rfqs, formatCurrency, formatDate } from '../data';

const filterOptions = [
  { key: 'status', label: 'Status', options: [
    { value: '', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'draft', label: 'Draft' },
    { value: 'closed', label: 'Closed' },
    { value: 'evaluating', label: 'Evaluating' },
  ]},
];

export default function RFQListing() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('cards');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');

  let filtered = rfqs.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filters.status || r.status === filters.status;
    return matchSearch && matchStatus;
  });

  if (sort === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created) - new Date(a.created));
  if (sort === 'deadline') filtered = [...filtered].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Request for Quotations"
        subtitle={`${rfqs.length} total RFQs`}
        actions={<Button icon={Plus} onClick={() => navigate('/rfq/create')}>Create RFQ</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Search RFQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
        >
          <option value="newest">Newest First</option>
          <option value="deadline">Deadline Soonest</option>
        </select>
        <AdvancedFilters filters={filterOptions} onApply={setFilters} />
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setView('cards')} className={`p-2.5 ${view === 'cards' ? 'bg-emerald-brand/10 text-emerald-brand' : 'text-foreground-subtle'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('table')} className={`p-2.5 ${view === 'table' ? 'bg-emerald-brand/10 text-emerald-brand' : 'text-foreground-subtle'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((rfq) => (
            <Card key={rfq.id} hover className="cursor-pointer" onClick={() => navigate('/quotations/submit')}>
              <div className="flex items-start justify-between mb-3">
                <Badge status={rfq.status} />
                <span className="text-xs text-foreground-subtle font-mono">{rfq.id}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{rfq.title}</h3>
              <p className="text-sm text-foreground-subtle line-clamp-2 mb-4">{rfq.description}</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-foreground-subtle">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(rfq.deadline)}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{rfq.responses} responses</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-foreground-subtle">Budget</span>
                <span className="font-medium text-foreground">{formatCurrency(rfq.budget)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['RFQ ID', 'Title', 'Status', 'Deadline', 'Responses', 'Budget'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-medium text-foreground-subtle uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((rfq) => (
                  <tr key={rfq.id} className="border-b border-border hover:bg-surface-muted cursor-pointer" onClick={() => navigate('/quotations/submit')}>
                    <td className="py-3 px-3 font-mono text-xs">{rfq.id}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{rfq.title}</td>
                    <td className="py-3 px-3"><Badge status={rfq.status} /></td>
                    <td className="py-3 px-3 text-foreground-subtle">{formatDate(rfq.deadline)}</td>
                    <td className="py-3 px-3">{rfq.responses}</td>
                    <td className="py-3 px-3 font-medium">{formatCurrency(rfq.budget)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
