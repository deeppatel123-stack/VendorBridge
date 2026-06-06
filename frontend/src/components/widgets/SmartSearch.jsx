import { Search, Command } from 'lucide-react';
import { useState } from 'react';

const suggestions = [
  'RFQ-2024-001',
  'DataCore Systems',
  'Pending approvals',
  'Purchase orders',
  'Monthly report',
];

export default function SmartSearch({ className = '' }) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center gap-2 rounded-xl border bg-surface-elevated px-4 py-2.5 transition-all duration-200 ${focused ? 'border-emerald-brand ring-2 ring-emerald-brand/25 shadow-sm' : 'border-border'}`}>
        <Search className="w-4 h-4 text-foreground-subtle shrink-0" />
        <input
          type="text"
          placeholder="Search vendors, RFQs, POs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle outline-none"
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-muted text-[10px] text-foreground-subtle font-mono border border-border">
          <Command className="w-3 h-3" />K
        </kbd>
      </div>
      {focused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-surface-elevated shadow-lg dark:shadow-black/40 z-50 p-2 animate-fade-in">
          <p className="text-[10px] uppercase tracking-wider text-foreground-subtle px-2 py-1">Suggestions</p>
          {suggestions.map((s) => (
            <button
              key={s}
              className="w-full text-left px-3 py-2 text-sm text-foreground rounded-lg hover:bg-surface-muted transition-colors"
              onMouseDown={() => setQuery(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
