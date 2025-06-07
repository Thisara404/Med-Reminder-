import React, { useState, createContext, useContext } from 'react';
// Define user types
type UserRole = 'patient' | 'caregiver' | null;
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  isAuthenticated: false
});
export const useAuth = () => useContext(AuthContext);
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  // Mock authentication functions
  const login = (email: string, password: string, role: UserRole) => {
    // In a real app, this would validate credentials with a backend
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    });
  };
  const register = (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, this would register the user with a backend
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    });
  };
  const logout = () => {
    setUser(null);
  };
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};