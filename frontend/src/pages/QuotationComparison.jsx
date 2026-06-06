import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Award } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AIRecommendation from '../components/widgets/AIRecommendation';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/DataState';
import { formatCurrency, entityId } from '../utils/formatters';
import { rfqsApi } from '../api/rfqs';
import { quotationsApi } from '../api/quotations';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

export default function QuotationComparison() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [sortBy, setSortBy] = useState('price');
  const [selectedRfqId, setSelectedRfqId] = useState(searchParams.get('rfq'));

  useEffect(() => {
    const q = searchParams.get('rfq');
    if (q) setSelectedRfqId(q);
  }, [searchParams]);

  const { data: rfqData, isLoading: rfqsLoading } = useQuery({
    queryKey: queryKeys.rfqs({ status: 'open', limit: 50 }),
    queryFn: () => rfqsApi.list({ status: 'open', limit: 50 }),
  });

  const rfqs = rfqData?.items || [];
  const rfqId = selectedRfqId || entityId(rfqs[0]);
  const currentRfq = rfqs.find((r) => entityId(r) === rfqId);

  const { data: comparison, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.quotationCompare(rfqId),
    queryFn: () => quotationsApi.compare(rfqId),
    enabled: !!rfqId,
  });

  const selectMutation = useMutation({
    mutationFn: quotationsApi.select,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      success('Winning quotation selected');
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to select winner'),
  });

  const quotes = comparison?.quotations || [];
  const summary = comparison?.summary || {};

  const sorted = [...quotes].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    return 0;
  });

  const lowestPrice = summary.lowestPrice ?? (quotes.length ? Math.min(...quotes.map((q) => q.price)) : 0);

  if (rfqsLoading) return <LoadingState message="Loading RFQs..." />;
  if (!rfqs.length) return <EmptyState message="No RFQs available for comparison" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Quotation Comparison"
        subtitle={currentRfq ? `${currentRfq.rfqNumber} — ${currentRfq.title}` : 'Compare vendor quotations'}
        actions={
          <>
            <select
              value={rfqId || ''}
              onChange={(e) => setSelectedRfqId(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              {rfqs.map((r) => (
                <option key={entityId(r)} value={entityId(r)}>{r.rfqNumber} — {r.title}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="price">Sort by Price</option>
              <option value="delivery">Sort by Delivery</option>
            </select>
            {summary.recommendedQuotationId && (
              <Button onClick={() => selectMutation.mutate(summary.recommendedQuotationId)} disabled={selectMutation.isPending}>
                Select Winner
              </Button>
            )}
          </>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error?.response?.data?.message || error.message} onRetry={refetch} />}
      {!isLoading && !isError && quotes.length === 0 && <EmptyState message="No quotations received for this RFQ" />}

      {!isLoading && !isError && quotes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Side-by-Side Comparison" subtitle={`${quotes.length} quotations received`} />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-medium text-foreground-subtle uppercase">Criteria</th>
                      {sorted.map((q) => (
                        <th key={entityId(q)} className="text-center py-3 px-4 min-w-[160px]">
                          <p className="font-semibold text-foreground">{q.vendor?.name}</p>
                          {(q.recommended || entityId(q) === summary.recommendedQuotationId) && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-dark bg-emerald-brand/10 px-2 py-0.5 rounded-full">
                              <Award className="w-3 h-3" /> Recommended
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-3 text-foreground-subtle font-medium">Price</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-3 px-4 text-center font-bold ${q.isLowestPrice || q.price === lowestPrice ? 'text-emerald-dark bg-emerald-brand/5' : 'text-foreground'}`}>
                          {formatCurrency(q.price)}
                          {(q.isLowestPrice || q.price === lowestPrice) && <span className="block text-[10px] text-emerald-brand font-normal">Lowest</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-3 text-foreground-subtle font-medium">Delivery</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className="py-3 px-4 text-center text-foreground">{q.deliveryDays} days</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-3 text-foreground-subtle font-medium">Rating</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-warm fill-amber-warm" />
                            {q.vendor?.rating}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-3 text-foreground-subtle font-medium">On-Time %</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className="py-3 px-4 text-center">{q.vendor?.onTimeDelivery}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-foreground-subtle font-medium">Notes</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className="py-3 px-4 text-center text-xs text-foreground-subtle">{q.notes}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <AIRecommendation leaderboard={sorted.map((q, i) => ({
              rank: i + 1,
              name: q.vendor?.name,
              score: Math.round((q.vendor?.rating || 0) * 20),
              trend: 'stable',
            }))} />
            <Card>
              <CardHeader title="Comparison Summary" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-emerald-brand/5">
                  <span className="text-foreground-muted">Best Price</span>
                  <span className="font-medium text-emerald-dark">{formatCurrency(lowestPrice)}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-surface-muted">
                  <span className="text-foreground-muted">Price Range</span>
                  <span className="font-medium">{formatCurrency(lowestPrice)} — {formatCurrency(summary.highestPrice)}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-surface-muted">
                  <span className="text-foreground-muted">Avg. Delivery</span>
                  <span className="font-medium">{summary.avgDelivery} days</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
