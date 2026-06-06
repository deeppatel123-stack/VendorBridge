import { useAuth } from './AuthContext';

export { ROLES } from './AuthContext';

/** @deprecated Use useAuth — kept for existing components */
export function RoleProvider({ children }) {
  return children;
}

export function useRole() {
  const auth = useAuth();
  return {
    role: auth.role || 'procurement',
    user: auth.user || { name: '', email: '', company: '', avatar: '?' },
    ROLES: auth.ROLES,
    setRole: () => {},
    setUser: () => {},
    logout: auth.logout,
  };
}
