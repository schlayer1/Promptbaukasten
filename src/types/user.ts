export type UserRole = 'teacher' | 'admin' | 'guest';
export type TeacherGender = 'f' | 'm' | 'd' | '';

export interface PortalUser {
  id: string;
  name: string;
  gender?: TeacherGender;
  sourceTeacherId?: string;
  pin: string;
  role: UserRole;
  active: boolean;
  createdAt: number;
}

export function formatTeacherName(
  teacher?: { name?: string | null; gender?: TeacherGender | string | null } | null
): string {
  const rawName = (teacher?.name || '').trim();
  if (!rawName) return '';
  const lower = rawName.toLowerCase();
  if (
    lower.startsWith('frau ') ||
    lower.startsWith('herr ') ||
    lower.startsWith('fr. ') ||
    lower.startsWith('hr. ') ||
    lower === 'gast' ||
    lower === 'nn' ||
    lower.includes('schulleitung')
  ) {
    return rawName;
  }
  if (teacher?.gender === 'f') return `Frau ${rawName}`;
  if (teacher?.gender === 'm') return `Herr ${rawName}`;
  return rawName;
}

export interface AuthState {
  currentUser: PortalUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
}
