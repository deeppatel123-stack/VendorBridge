import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import SmartSearch from '../components/widgets/SmartSearch';
import ThemeToggle from '../components/ui/ThemeToggle';
import Logo from '../components/brand/Logo';
import { notifications } from '../data';

export default function Topbar({ onMenuClick }) {
  const { role, setRole, user, ROLES } = useRole();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center gap-4 px-4 lg:px-6 py-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors interactive">
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <div className="hidden lg:flex items-center gap-3 mr-2">
          <Logo variant="icon" />
        </div>

        <SmartSearch className="flex-1 max-w-md hidden sm:block" />

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle className="hidden lg:flex" />

          <button className="relative p-2 rounded-lg hover:bg-surface-muted transition-colors interactive">
            <Bell className="w-5 h-5 text-foreground-subtle" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-brand text-white text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
                {unread}
              </span>
            )}
          </button>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="hidden md:block text-xs rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-brand/25 transition-colors"
          >
            {Object.entries(ROLES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-lg bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand flex items-center justify-center text-xs font-bold">
              {user.avatar}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground leading-none">{user.name}</p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">{ROLES[role]}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-foreground-subtle hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
