import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PortalUser, AuthState } from '../types/user';
import {
  getCachedCurrentUser,
  getCachedTeachers,
  loginWithPin,
  loginAsGuest,
  logoutUser,
  subscribeToSyncedTeachers,
  AUTH_USER_KEY
} from '../services/firebase';

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
  const [teachersList, setTeachersList] = useState<PortalUser[]>(() => getCachedTeachers());
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(() => getCachedCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const refreshTeachersRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const { refresh, unsubscribe } = subscribeToSyncedTeachers((updatedList) => {
      setTeachersList(updatedList);
      setCurrentUser(prev => {
        if (!prev || prev.role === 'guest' || prev.id === 'admin-master') return prev;
        const fresh = updatedList.find(
          u =>
            u.id === prev.id ||
            (prev.sourceTeacherId && u.sourceTeacherId === prev.sourceTeacherId) ||
            u.name.trim().toLowerCase() === prev.name.trim().toLowerCase()
        );
        if (!fresh) return prev;
        const nextUser: PortalUser = {
          ...fresh,
          role: prev.role === 'admin' ? 'admin' : fresh.role
        };
        if (
          nextUser.name === prev.name &&
          (nextUser.gender || '') === (prev.gender || '') &&
          nextUser.pin === prev.pin &&
          nextUser.active === prev.active &&
          nextUser.role === prev.role &&
          nextUser.id === prev.id
        ) {
          return prev;
        }
        try {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
        } catch {}
        return nextUser;
      });
    });
    refreshTeachersRef.current = refresh;

    const handleStorage = () => {
      setCurrentUser(getCachedCurrentUser());
    };
    const handleFocus = () => {
      refresh();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const login = async (userId: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    const res = loginWithPin(userId, pin, teachersList);
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

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    refreshTeachersRef.current?.();
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'admin',
    isGuest: currentUser?.role === 'guest',
    teachersList,
    isLoginModalOpen,
    openLoginModal,
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
