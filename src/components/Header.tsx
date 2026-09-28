import React from 'react';
import { 
  Sparkles, 
  Key, 
  RotateCcw, 
  Layers, 
  ExternalLink,
  GraduationCap,
  BookOpen,
  User,
  LogOut,
  Lock
} from 'lucide-react';
import { AiProvider } from '../types/ai';
import { PROVIDER_CONFIGS } from '../data/defaultPresets';
import { getEffectiveApiKey } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  selectedProvider: AiProvider;
  onSelectProvider: (provider: AiProvider) => void;
  onOpenKeyModal: () => void;
  onOpenLibrary: () => void;
  onResetForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedProvider,
  onSelectProvider,
  onOpenKeyModal,
  onOpenLibrary,
  onResetForm
}) => {
  const { currentUser, isAuthenticated, openLoginModal, logout } = useAuth();
  const providers: AiProvider[] = ['gemini', 'groq', 'mistral', 'openrouter'];
  const currentKeyInfo = getEffectiveApiKey(selectedProvider);
  const isCurrentConfigured = !!currentKeyInfo;

  return (
    <header className="bg-white border-b border-school-border sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <a 
              href="https://schulportal-kahla.web.app" 
              title="Zurück zum HBS Appportal"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-school-primary to-school-primaryContainer flex items-center justify-center text-white shadow-soft shrink-0 hover:scale-105 transition-transform"
            >
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-lg text-school-textMain truncate leading-tight">
                  KI-Unterrichts-Baukasten
                </h1>
                <span className="hidden md:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full bg-school-primaryLight text-school-primary border border-school-primary/20 shrink-0">
                  Thüringer Regelschule
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate hidden sm:block">
                ThILLM-Lehrplanstandard • KMK AFB I–III • HTML5 Lernspiele & Druckblätter
              </p>
            </div>
          </div>

          {/* ACTIONS & BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* SCHUL-BIBLIOTHEK (KOLLEGIUMS-FUNDUS) */}
            <button
              onClick={onOpenLibrary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-bold transition shadow-sm"
              title="Schul-Bibliothek: Gespeicherte Materialien des Kollegiums ansehen und laden"
            >
              <BookOpen className="w-4 h-4 text-school-primary" />
              <span className="hidden sm:inline">Schul-Bibliothek</span>
            </button>

            {/* PROVIDER SELECTOR (DESKTOP) */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {providers.map(p => {
                const isSelected = selectedProvider === p;
                const hasKey = !!getEffectiveApiKey(p);
                return (
                  <button
                    key={p}
                    onClick={() => onSelectProvider(p)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-white text-school-primary shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    {PROVIDER_CONFIGS[p].name.replace('Google ', '').replace(' Cloud', '')}
                  </button>
                );
              })}
            </div>

            {/* PROVIDER SELECTOR (TABLET / MOBILE) */}
            <div className="xl:hidden">
              <select
                value={selectedProvider}
                onChange={e => onSelectProvider(e.target.value as AiProvider)}
                className="text-base sm:text-xs font-semibold bg-slate-100 border border-slate-300 rounded-xl px-2 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-primary"
              >
                {providers.map(p => (
                  <option key={p} value={p}>
                    {PROVIDER_CONFIGS[p].name}
                  </option>
                ))}
              </select>
            </div>

            {/* KEY SETTINGS BUTTON */}
            <button
              onClick={onOpenKeyModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
                isCurrentConfigured
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
              title="API-Schlüssel & KI-Anbieter konfigurieren"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keys</span>
              <span className={`w-2 h-2 rounded-full ${isCurrentConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>

            {/* USER LOGIN / STATUS BADGE */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1 bg-slate-100 pl-2.5 pr-1 py-1 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 max-w-[90px] sm:max-w-[120px] truncate" title={`Angemeldet als ${currentUser.name}`}>
                  {currentUser.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Abmelden"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-primary text-white text-xs font-bold hover:bg-school-primaryDark transition shadow-sm"
                title="Mit 4-stelliger PIN aus dem HBS Appportal anmelden"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">PIN-Login</span>
              </button>
            )}

            {/* RESET BUTTON */}
            <button
              onClick={onResetForm}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="Formular zurücksetzen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
