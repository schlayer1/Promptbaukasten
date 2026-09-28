import React from 'react';
import { 
  Sparkles, 
  Key, 
  RotateCcw, 
  Layers, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { AiProvider } from '../types/ai';
import { PROVIDER_CONFIGS } from '../data/defaultPresets';
import { getEffectiveApiKey } from '../services/aiService';

interface HeaderProps {
  selectedProvider: AiProvider;
  onSelectProvider: (provider: AiProvider) => void;
  onOpenKeyModal: () => void;
  onResetForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedProvider,
  onSelectProvider,
  onOpenKeyModal,
  onResetForm
}) => {
  const providers: AiProvider[] = ['gemini', 'groq', 'mistral', 'openrouter'];
  const currentKeyInfo = getEffectiveApiKey(selectedProvider);
  const isCurrentConfigured = !!currentKeyInfo;

  return (
    <header className="bg-white border-b border-school-border sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-school-primary to-school-primaryContainer flex items-center justify-center text-white shadow-soft shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-school-textMain truncate leading-tight">
                  KI-Unterrichts-Baukasten & Lernspiel-Werkstatt
                </h1>
                <span className="hidden md:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full bg-school-primaryLight text-school-primary border border-school-primary/20 shrink-0">
                  Thüringer Regelschule
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                ThILLM-Lehrplanstandard • KMK AFB I–III • Single-File HTML5 Lernspiele & Druckblätter
              </p>
            </div>
          </div>

          {/* ACTIONS & PROVIDER QUICK-SWITCHER */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* PROVIDER SELECTOR */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {providers.map(p => {
                const isSelected = selectedProvider === p;
                const hasKey = !!getEffectiveApiKey(p);
                return (
                  <button
                    key={p}
                    onClick={() => onSelectProvider(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
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

            {/* MOBILE PROVIDER DROPDOWN */}
            <div className="lg:hidden">
              <select
                value={selectedProvider}
                onChange={e => onSelectProvider(e.target.value as AiProvider)}
                className="text-xs font-semibold bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-primary"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
                isCurrentConfigured
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
              title="API-Schlüssel & KI-Anbieter konfigurieren"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API-Keys</span>
              <span className={`w-2 h-2 rounded-full ${isCurrentConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>

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
