import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const VALID_USERS = [
  { username: 'manoj', password: 'Manoj@PierianSms1', name: 'Manoj', role: 'Admin' },
  { username: 'admin', password: 'admin123', name: 'Administrator', role: 'Admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((username, password) => {
    const found = VALID_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (found) {
      const userData = { username: found.username, name: found.name, role: found.role };
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
