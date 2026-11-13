import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';
import { PortalUser, TeacherGender } from '../types/user';
import { CloudMaterial } from '../types/cloud';

// Offizielle Firebase Konfiguration des HBS App-Portals (terminkalender-7f269)
// API-Key wird sicher aus Umgebungsvariablen bezogen (niemals im Quellcode hinterlegt)
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: ((import.meta as any).env?.VITE_FIREBASE_API_KEY as string)?.trim() || "",
  authDomain: "terminkalender-7f269.firebaseapp.com",
  projectId: "terminkalender-7f269",
  storageBucket: "terminkalender-7f269.firebasestorage.app",
  messagingSenderId: "919163141331",
  appId: "1:919163141331:web:12c659f5c2946e7c7e2826"
};

export const MASTER_ADMIN_PIN = "Year2003?!%";
export const MATERIALS_COLLECTION = "hbs_promptbaukasten_materials";
export const AUTH_USER_KEY = 'hbs_current_portal_user_v1';
const LOCAL_MATERIALS_KEY = 'hbs_promptbaukasten_local_cache_v1';

// Initial seed teachers matching official Heimbürgeschule Kollegiumsliste
export const INITIAL_SEED_TEACHERS: PortalUser[] = [
  { id: "t-allerdt", name: "Allerdt", pin: "6300", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-dengler", name: "Dengler", pin: "8991", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-funk", name: "Funk", pin: "1091", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-graefe", name: "Gräfe", pin: "6169", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-gruchmann", name: "Gruchmann", pin: "4444", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-haase", name: "Haase", pin: "8511", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-halm", name: "Halm", pin: "1350", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-herold", name: "Herold", pin: "2116", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-illessy", name: "Illessy", pin: "2479", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-keim", name: "Keim", pin: "9672", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-keller", name: "Keller", pin: "6079", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-kleinfeld", name: "Kleinfeld", pin: "5901", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-koenig", name: "König", pin: "2699", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-koenitzern", name: "Könitzer N", pin: "2535", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-koentizert", name: "Könitzer T", pin: "7909", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-mange", name: "Mange", pin: "3518", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-meier", name: "Meier", pin: "8652", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-nn", name: "nn", pin: "1266", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-nowak", name: "Nowak", pin: "6652", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-ottma", name: "Ottma", pin: "7710", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-petzold", name: "Petzold", pin: "6244", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-piel", name: "Piel", pin: "8814", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-schirmer", name: "Schirmer", pin: "8386", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-schmidt", name: "Schmidt", pin: "6403", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-schwappach", name: "Schwappach", pin: "7673", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-seifert", name: "Seifert", pin: "3314", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-surowy", name: "Surowy", pin: "9330", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-teubert", name: "Teubert", pin: "5812", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-thum", name: "Thum", pin: "2012", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-vogel", name: "Vogel", pin: "1027", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-voigt", name: "Voigt", pin: "5067", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-wagner", name: "Wagner", pin: "7734", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-weber", name: "Weber", pin: "2540", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-wesely", name: "Wesely", pin: "7484", role: "teacher", active: true, createdAt: Date.now() }
];

export let db: Firestore | null = null;

try {
  if (DEFAULT_FIREBASE_CONFIG.apiKey) {
    const app = getApps().length === 0 ? initializeApp(DEFAULT_FIREBASE_CONFIG) : getApp();
    db = getFirestore(app);
  }
} catch (err) {
  console.warn("[Firebase] Init-Warnung (Offline Cache aktiv):", err);
}

const TEACHERS_CACHE_KEY = 'hbs_promptbaukasten_teachers_cache_v1';

interface StatistikTeacherRaw {
  id?: string;
  name?: string;
  pin?: string;
  gender?: string;
  active?: boolean;
}

const normalizeGender = (val: unknown): TeacherGender => {
  if (val === 'f' || val === 'm' || val === 'd') return val;
  return '';
};

export function getCachedTeachers(): PortalUser[] {
  if (typeof window === 'undefined') return INITIAL_SEED_TEACHERS;
  try {
    const raw = localStorage.getItem(TEACHERS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_SEED_TEACHERS;
}

function setCachedTeachers(teachers: PortalUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEACHERS_CACHE_KEY, JSON.stringify(teachers));
  } catch {}
}

function mergeTeachers(baseUsers: PortalUser[], statistikList: StatistikTeacherRaw[]): PortalUser[] {
  const merged = baseUsers.map(u => ({ ...u }));
  statistikList.forEach(st => {
    const rawName = (st?.name || '').trim();
    if (!rawName || rawName.toLowerCase().includes('schulleitung')) return;

    const stId = st.id ? String(st.id).trim() : '';
    const cleanLower = rawName.toLowerCase();
    const idx = merged.findIndex(
      u =>
        (stId && (u.sourceTeacherId === stId || u.id === `t-${stId}` || u.id === stId)) ||
        u.name.trim().toLowerCase() === cleanLower
    );

    const rawPin = st.pin !== undefined && st.pin !== null ? String(st.pin).trim() : '';
    const validPin = /^\d{4,}$/.test(rawPin) ? rawPin : '';
    const hasGenderField = st.gender !== undefined && st.gender !== null;
    const incomingGender = normalizeGender(st.gender);
    const incomingActive = st.active !== false;

    if (idx >= 0) {
      const target = merged[idx];
      if (validPin) target.pin = validPin;
      if (hasGenderField) target.gender = incomingGender;
      target.name = rawName;
      target.active = incomingActive;
      if (stId) target.sourceTeacherId = stId;
    } else if (validPin) {
      merged.push({
        id: stId ? `t-${stId}` : `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sourceTeacherId: stId || undefined,
        name: rawName,
        gender: incomingGender,
        pin: validPin,
        role: 'teacher',
        active: incomingActive,
        createdAt: Date.now()
      });
    }
  });
  return merged;
}

/**
 * Loads authoritative teacher list from Vertretungsstatistik (statistik-91f25/schools/HBS)
 * via keyless Firestore REST API (no hardcoded API keys).
 */
export async function fetchStatistikTeachersViaRest(): Promise<StatistikTeacherRaw[]> {
  try {
    const res = await fetch(
      'https://firestore.googleapis.com/v1/projects/statistik-91f25/databases/(default)/documents/schools/HBS'
    );
    if (!res.ok) return [];
    const docJson = await res.json();
    const values = docJson?.fields?.teachers?.arrayValue?.values;
    if (!Array.isArray(values)) return [];
    return values.map((v: any) => {
      const f = v?.mapValue?.fields || {};
      return {
        id: f.id?.stringValue ?? '',
        name: f.name?.stringValue ?? '',
        pin: f.pin?.stringValue ?? '',
        gender: f.gender?.stringValue ?? '',
        active: f.active?.booleanValue !== undefined ? Boolean(f.active.booleanValue) : true
      };
    });
  } catch (err) {
    console.warn("[Firebase] Statistik REST Sync-Warnung:", err);
    return [];
  }
}

export function subscribeToSyncedTeachers(callback: (teachers: PortalUser[]) => void): {
  refresh: () => Promise<void>;
  unsubscribe: () => void;
} {
  let latestBase: PortalUser[] = getCachedTeachers();
  let latestStatistik: StatistikTeacherRaw[] = [];
  let unsubPortal: (() => void) | null = null;

  const emitMerged = () => {
    const next = mergeTeachers(latestBase, latestStatistik);
    setCachedTeachers(next);
    callback(next);
  };

  const refresh = async () => {
    const statList = await fetchStatistikTeachersViaRest();
    if (statList.length > 0) {
      latestStatistik = statList;
      emitMerged();
    }
  };

  if (db) {
    try {
      const portalRef = doc(db, "hbs_appportal", "portal_data");
      unsubPortal = onSnapshot(portalRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.users) && data.users.length > 0) {
            latestBase = data.users;
            emitMerged();
          }
        }
      }, () => {});
    } catch {}
  }

  refresh();

  return {
    refresh,
    unsubscribe: () => {
      if (unsubPortal) unsubPortal();
    }
  };
}

// --- AUTHENTIFIZIERUNG ---

export function getCachedCurrentUser(): PortalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loginWithPin(
  userId: string,
  pin: string,
  availableTeachers?: PortalUser[]
): { success: boolean; user?: PortalUser; error?: string } {
  const list = availableTeachers && availableTeachers.length > 0 ? availableTeachers : getCachedTeachers();

  // 1. Admin Master-PIN
  if (pin === MASTER_ADMIN_PIN) {
    const target = list.find(t => t.id === userId) || {
      id: "admin-master",
      name: "Schulleitung / Admin",
      pin: MASTER_ADMIN_PIN,
      role: "admin" as const,
      active: true,
      createdAt: Date.now()
    };
    const adminUser: PortalUser = { ...target, role: "admin" };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  }

  // 2. Lehrer-PIN prüfen
  const teacher = list.find(t => t.id === userId && t.active !== false);
  if (!teacher) {
    return { success: false, error: "Lehrkraft nicht gefunden." };
  }

  if (teacher.pin !== pin.trim()) {
    return { success: false, error: "Ungültige 4-stellige PIN." };
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(teacher));
  return { success: true, user: teacher };
}

export function loginAsGuest(): PortalUser {
  const guestUser: PortalUser = {
    id: "guest-" + Math.random().toString(36).substring(2, 7),
    name: "Gast (Kollegium)",
    pin: "",
    role: "guest",
    active: true,
    createdAt: Date.now()
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(guestUser));
  return guestUser;
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

// --- FIRESTORE MATERIALIEN SPEICHERN & LADEN ---

export async function saveMaterialToCloud(
  materialData: Omit<CloudMaterial, 'id' | 'createdAt'>,
  existingId?: string
): Promise<CloudMaterial> {
  const id = existingId || `mat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();
  
  const material: CloudMaterial = {
    ...materialData,
    id,
    createdAt: existingId ? (materialData as any).createdAt || now : now,
    updatedAt: now
  };

  // 1. In lokalem Backup speichern
  try {
    const local = getLocalMaterials();
    const updated = [material, ...local.filter(m => m.id !== id)];
    localStorage.setItem(LOCAL_MATERIALS_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn("[LocalCache] Speicher-Warnung:", e);
  }

  // 2. In Firebase Firestore speichern
  if (db) {
    try {
      const docRef = doc(db, MATERIALS_COLLECTION, id);
      await setDoc(docRef, material, { merge: true });
      console.log(`[Firebase] Material "${material.title}" erfolgreich in Firestore gespeichert.`);
    } catch (err) {
      console.warn("[Firebase] Konnte nicht in Firestore schreiben (nutze lokalen Cache):", err);
    }
  }

  return material;
}

export async function loadMaterialsFromCloud(): Promise<CloudMaterial[]> {
  const localList = getLocalMaterials();

  if (!db) {
    return localList;
  }

  try {
    const colRef = collection(db, MATERIALS_COLLECTION);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const cloudMaterials: CloudMaterial[] = [];
    snapshot.forEach(docSnap => {
      cloudMaterials.push(docSnap.data() as CloudMaterial);
    });

    if (cloudMaterials.length > 0) {
      // Lokalen Cache aktualisieren
      try {
        localStorage.setItem(LOCAL_MATERIALS_KEY, JSON.stringify(cloudMaterials.slice(0, 50)));
      } catch {}
      return cloudMaterials;
    }
  } catch (err) {
    console.warn("[Firebase] Fehler beim Laden aus Firestore, greife auf Cache zurück:", err);
  }

  return localList;
}

export async function deleteMaterialFromCloud(id: string): Promise<boolean> {
  // 1. Aus lokalem Cache entfernen
  try {
    const local = getLocalMaterials().filter(m => m.id !== id);
    localStorage.setItem(LOCAL_MATERIALS_KEY, JSON.stringify(local));
  } catch {}

  // 2. Aus Firestore löschen
  if (db) {
    try {
      const docRef = doc(db, MATERIALS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn("[Firebase] Fehler beim Löschen aus Firestore:", err);
    }
  }
  return true;
}

function getLocalMaterials(): CloudMaterial[] {
  try {
    const raw = localStorage.getItem(LOCAL_MATERIALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
