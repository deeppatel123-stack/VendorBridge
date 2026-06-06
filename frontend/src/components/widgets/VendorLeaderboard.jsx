import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { leaderboard, getVendorById } from '../../data';

const trendIcons = {
  up: { icon: TrendingUp, color: 'text-emerald-brand' },
  down: { icon: TrendingDown, color: 'text-red-500' },
  stable: { icon: Minus, color: 'text-foreground-subtle' },
};

export default function VendorLeaderboard() {
  return (
    <Card>
      <CardHeader title="Vendor Leaderboard" subtitle="Top performers this quarter" />
      <div className="space-y-3">
        {leaderboard.map((entry) => {
          const vendor = getVendorById(entry.vendorId);
          const { icon: TrendIcon, color } = trendIcons[entry.trend];
          return (
            <div key={entry.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-muted transition-colors">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${entry.rank === 1 ? 'bg-amber-warm/20 text-amber-600' : 'bg-surface-muted text-foreground-subtle'}`}>
                {entry.rank === 1 ? <Trophy className="w-3.5 h-3.5" /> : entry.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{vendor?.name}</p>
                <p className="text-xs text-foreground-subtle">{vendor?.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{entry.score}</p>
                <TrendIcon className={`w-3.5 h-3.5 ${color} ml-auto`} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
