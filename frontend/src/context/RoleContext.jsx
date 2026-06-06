import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

export const ROLES = {
  admin: 'Admin',
  vendor: 'Vendor',
  manager: 'Manager',
  procurement: 'Procurement Officer',
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState('procurement');
  const [user, setUser] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@acmecorp.com',
    company: 'Acme Corporation',
    avatar: 'SC',
  });

  return (
    <RoleContext.Provider value={{ role, setRole, user, setUser, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
