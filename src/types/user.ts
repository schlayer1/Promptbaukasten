export type UserRole = 'teacher' | 'admin' | 'guest';

export interface PortalUser {
  id: string;
  name: string;
  pin: string;
  role: UserRole;
  active: boolean;
  createdAt: number;
}

export interface AuthState {
  currentUser: PortalUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
}
