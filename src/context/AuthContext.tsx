import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortalUser, AuthState } from '../types/user';
import { getCachedCurrentUser, loginWithPin, loginAsGuest, logoutUser, INITIAL_SEED_TEACHERS } from '../services/firebase';

interface AuthContextType extends AuthState {
  teachersList: PortalUser[];
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (userId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  loginGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(() => getCachedCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setCurrentUser(getCachedCurrentUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (userId: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    const res = loginWithPin(userId, pin);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setIsLoginModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || "Ungültige PIN." };
  };

  const loginGuest = () => {
    const guest = loginAsGuest();
    setCurrentUser(guest);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'admin',
    isGuest: currentUser?.role === 'guest',
    teachersList: INITIAL_SEED_TEACHERS,
    isLoginModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false),
    login,
    loginGuest,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
