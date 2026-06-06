import { useNavigate } from 'react-router-dom';
import {
  Clock, FileText, ShoppingCart, Receipt, Plus, GitCompare, Users, CheckSquare,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Logo from '../components/brand/Logo';
import { useRole } from '../context/RoleContext';
import { useChartTheme } from '../utils/chartTheme';
import {
  monthlySpending, vendorPerformance, rfqs, approvals, purchaseOrders, invoices, formatCurrency,
} from '../data';
import AIRecommendation from '../components/widgets/AIRecommendation';
import ProcurementScore from '../components/widgets/ProcurementScore';
import CostSavings from '../components/widgets/CostSavings';
import NotificationCenter from '../components/widgets/NotificationCenter';
import ActivityFeed from '../components/widgets/ActivityFeed';
import VendorLeaderboard from '../components/widgets/VendorLeaderboard';
import ProcurementHeatmap from '../components/widgets/ProcurementHeatmap';
import ProcurementCalendar from '../components/widgets/ProcurementCalendar';
import KPIDashboard from '../components/widgets/KPIDashboard';

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Users" value="48" change="+3" trend="up" icon={Users} color="cyan" />
        <StatCard title="Active Vendors" value="24" change="+2" trend="up" icon={Users} color="emerald" />
        <StatCard title="System Uptime" value="99.9%" icon={CheckSquare} color="charcoal" />
      </div>
      <KPIDashboard />
    </div>
  );
}

function VendorDashboard() {
  const activeRFQs = rfqs.filter((r) => r.status === 'open').length;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Active RFQs" value={activeRFQs} icon={FileText} color="cyan" />
      <StatCard title="Submitted Quotes" value="8" change="+2" trend="up" icon={Receipt} color="emerald" />
      <StatCard title="POs Received" value="5" icon={ShoppingCart} color="amber" />
    </div>
  );
}

function ManagerDashboard() {
  const pending = approvals.filter((a) => a.status === 'pending').length;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Pending Approvals" value={pending} icon={Clock} color="amber" />
      <StatCard title="Approved This Month" value="12" change="+4" trend="up" icon={CheckSquare} color="emerald" />
      <StatCard title="Avg. Response Time" value="1.8 days" icon={Clock} color="cyan" />
    </div>
  );
}

export default function Dashboard() {
  const { role } = useRole();
  const navigate = useNavigate();
  const chart = useChartTheme();

  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
  const activeRFQs = rfqs.filter((r) => r.status === 'open').length;
  const activePOs = purchaseOrders.length;
  const pendingInvoices = invoices.filter((i) => i.status !== 'paid').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's your procurement overview"
        logo={<Logo variant="icon" className="hidden sm:block" />}
        actions={
          <>
            <Button variant="outline" icon={GitCompare} onClick={() => navigate('/quotations/compare')}>
              Compare Quotes
            </Button>
            <Button icon={Plus} onClick={() => navigate('/rfq/create')}>
              Create RFQ
            </Button>
          </>
        }
      />

      {role === 'admin' && <AdminDashboard />}
      {role === 'vendor' && <VendorDashboard />}
      {role === 'manager' && <ManagerDashboard />}

      {role === 'procurement' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Pending Approvals" value={pendingApprovals} change="+2" trend="up" icon={Clock} color="amber" />
          <StatCard title="Active RFQs" value={activeRFQs} icon={FileText} color="cyan" />
          <StatCard title="Purchase Orders" value={activePOs} change="+1" trend="up" icon={ShoppingCart} color="emerald" />
          <StatCard title="Pending Invoices" value={pendingInvoices} icon={Receipt} color="charcoal" />
        </div>
      )}

      <KPIDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Monthly Spending" subtitle="Procurement expenditure trend" />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlySpending}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.colors.emerald} stopOpacity={chart.isDark ? 0.35 : 0.3} />
                    <stop offset="100%" stopColor={chart.colors.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: chart.axis }} />
                <YAxis tick={{ fontSize: 12, fill: chart.axis }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={chart.tooltip} />
                <Area type="monotone" dataKey="spending" stroke={chart.colors.emerald} fill="url(#spendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <CardHeader title="Vendor Performance" subtitle="Multi-dimensional vendor scoring" />
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={vendorPerformance}>
                <PolarGrid stroke={chart.polarGrid} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: chart.axis }} />
                <Radar name="Delivery" dataKey="delivery" stroke={chart.colors.emerald} fill={chart.colors.emerald} fillOpacity={chart.isDark ? 0.2 : 0.15} />
                <Radar name="Quality" dataKey="quality" stroke={chart.colors.cyan} fill={chart.colors.cyan} fillOpacity={chart.isDark ? 0.15 : 0.1} />
                <Tooltip contentStyle={chart.tooltip} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="space-y-6">
          <AIRecommendation />
          <ProcurementScore />
          <CostSavings />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <NotificationCenter />
        <Card>
          <CardHeader title="Procurement Status" subtitle="Pipeline overview" />
          <div className="space-y-3">
            {[
              { label: 'Draft RFQs', count: rfqs.filter((r) => r.status === 'draft').length, color: 'bg-foreground-subtle' },
              { label: 'Open RFQs', count: activeRFQs, color: 'bg-cyan-soft' },
              { label: 'Evaluating', count: rfqs.filter((r) => r.status === 'evaluating').length, color: 'bg-amber-warm' },
              { label: 'Approved POs', count: purchaseOrders.filter((p) => p.status === 'approved').length, color: 'bg-emerald-brand' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-foreground-muted flex-1">{item.label}</span>
                <Badge>{item.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorLeaderboard />
        <ProcurementHeatmap />
        <ProcurementCalendar />
      </div>

      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Create RFQ', icon: FileText, path: '/rfq/create' },
            { label: 'Add Vendor', icon: Users, path: '/vendors' },
            { label: 'Compare Quotes', icon: GitCompare, path: '/quotations/compare' },
            { label: 'View Approvals', icon: CheckSquare, path: '/approvals' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-emerald-brand/30 hover:bg-emerald-brand/5 transition-all card-hover interactive"
            >
              <action.icon className="w-5 h-5 text-emerald-brand" />
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
