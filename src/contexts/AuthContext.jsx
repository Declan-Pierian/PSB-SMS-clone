import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DEMO_USERS, ROLES, ROLE_LABELS, hasModuleAccess, hasPathAccess, filterMenuByRole, hasAnyRole, isInRoleGroup } from '../data/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((username, password) => {
    const found = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (found) {
      const userData = {
        username: found.username,
        name: found.name,
        role: found.role,
        roleLabel: ROLE_LABELS[found.role] || found.role,
      };
      setUser(userData);
      localStorage.setItem('sms_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sms_user');
  }, []);

  const permissions = useMemo(() => {
    if (!user) return {};
    const role = user.role;
    return {
      role,
      roleLabel: user.roleLabel || ROLE_LABELS[role] || role,
      isRoot: role === ROLES.ROOT,
      isStudent: role === ROLES.STUDENT,
      isSales: isInRoleGroup(role, 'Sales'),
      isAdmission: isInRoleGroup(role, 'Admission'),
      isAdmin: isInRoleGroup(role, 'Admin'),
      isExam: role === ROLES.EXAM,
      isFinance: role === ROLES.FINANCE,
      canAccessModule: (moduleId) => hasModuleAccess(role, moduleId),
      canAccessPath: (path) => hasPathAccess(role, path),
      hasAnyRole: (roles) => hasAnyRole(role, roles),
      filterMenu: (menuItems) => filterMenuByRole(menuItems, role),
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}