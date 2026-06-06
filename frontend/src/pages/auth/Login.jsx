import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCog } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useRole } from '../../context/RoleContext';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'procurement', label: 'Procurement Officer' },
  { value: 'manager', label: 'Manager / Approver' },
  { value: 'vendor', label: 'Vendor' },
];

export default function Login() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRoleLocal] = useState('procurement');

  const handleLogin = (e) => {
    e.preventDefault();
    setRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h2>
        <p className="text-sm text-foreground-subtle mt-1">Sign in to your VendorBridge account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <div className="auth-input-wrap">
            <Mail className="auth-input-icon" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <div className="auth-input-wrap">
            <Lock className="auth-input-icon" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="role">Sign in as</label>
          <div className="auth-input-wrap">
            <UserCog className="auth-input-icon" />
            <select id="role" value={role} onChange={(e) => setRoleLocal(e.target.value)}>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-foreground-subtle cursor-pointer">
            <input type="checkbox" className="rounded border-border-strong text-emerald-brand w-3.5 h-3.5" />
            Remember me
          </label>
          <Link to="#" className="text-emerald-brand hover:text-emerald-dark font-medium transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" icon={ArrowRight}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-subtle mt-5">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-emerald-brand font-semibold hover:text-emerald-dark transition-colors">
          Create account
        </Link>
      </p>
    </div>
  );
}
