import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back!');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      toastError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
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

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-foreground-subtle cursor-pointer">
            <input type="checkbox" className="rounded border-border-strong text-emerald-brand w-3.5 h-3.5" />
            Remember me
          </label>
          <Link to="#" className="text-emerald-brand hover:text-emerald-dark font-medium transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" icon={ArrowRight} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
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
