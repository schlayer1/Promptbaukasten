import React from 'react';
import { 
  Gamepad2, 
  Layers, 
  ArrowDownUp, 
  User, 
  Users2, 
  KeyRound, 
  Sparkles,
  Brain
} from 'lucide-react';
import { GameMode, GameSocialMode, GameStoryTheme } from '../../types/generator';

interface StepGameOptionsProps {
  gameMode: GameMode;
  gameSocialMode: GameSocialMode;
  includeMisconceptions: boolean;
  gameStoryTheme: GameStoryTheme;
  onGameModeChange: (mode: GameMode) => void;
  onSocialModeChange: (mode: GameSocialMode) => void;
  onMisconceptionsToggle: (enabled: boolean) => void;
  onStoryThemeChange: (theme: GameStoryTheme) => void;
}

export const StepGameOptions: React.FC<StepGameOptionsProps> = ({
  gameMode,
  gameSocialMode,
  includeMisconceptions,
  gameStoryTheme,
  onGameModeChange,
  onSocialModeChange,
  onMisconceptionsToggle,
  onStoryThemeChange
}) => {
  return (
    <div className="space-y-4 pt-3 border-t border-slate-100 bg-sky-50/50 p-4 rounded-2xl border border-sky-100 animate-fadeIn">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-school-primary flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-school-primary" />
          Lernspiel-Feintuning & Interaktion
        </label>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-school-primary text-white">
          Spezialmodus
        </span>
      </div>

      {/* 1. SPIELMECHANIK */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          1. Spielmechanik wählen:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* QUIZ */}
          <button
            type="button"
            onClick={() => onGameModeChange('quiz')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
              gameMode === 'quiz'
                ? 'bg-white border-school-primary ring-2 ring-school-primary/20 shadow-sm text-school-primary'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${gameMode === 'quiz' ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Arcade-Quiz</div>
              <div className="text-[10px] text-slate-500">Multiple-Choice & Streak</div>
            </div>
          </button>

          {/* MEMORY */}
          <button
            type="button"
            onClick={() => onGameModeChange('memory')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
              gameMode === 'memory'
                ? 'bg-white border-school-primary ring-2 ring-school-primary/20 shadow-sm text-school-primary'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${gameMode === 'memory' ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Karten-Memory</div>
              <div className="text-[10px] text-slate-500">Paare & Wortspeicher</div>
            </div>
          </button>

          {/* ORDER */}
          <button
            type="button"
            onClick={() => onGameModeChange('order')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
              gameMode === 'order'
                ? 'bg-white border-school-primary ring-2 ring-school-primary/20 shadow-sm text-school-primary'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${gameMode === 'order' ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              <ArrowDownUp className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Chronologie</div>
              <div className="text-[10px] text-slate-500">Schritte / Ablauf ordnen</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. SPIELSZENARIO / SOZIALFORM */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          2. Unterrichts-Szenario:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* SOLO */}
          <button
            type="button"
            onClick={() => onSocialModeChange('solo')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
              gameSocialMode === 'solo'
                ? 'bg-white border-school-primary ring-2 ring-school-primary/20 shadow-sm text-school-primary'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${gameSocialMode === 'solo' ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Einzelspieler</div>
              <div className="text-[10px] text-slate-500">Selbsttest & Urkunde</div>
            </div>
          </button>

          {/* DUELL */}
          <button
            type="button"
            onClick={() => onSocialModeChange('duell')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
              gameSocialMode === 'duell'
                ? 'bg-white border-school-primary ring-2 ring-school-primary/20 shadow-sm text-school-primary'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${gameSocialMode === 'duell' ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">2-Spieler-Duell</div>
              <div className="text-[10px] text-slate-500">Split-Screen an 1 iPad</div>
            </div>
          </button>

          {/* ESCAPE */}
          <button
            type="button"
            onClick={() => onSocialModeChange('escape')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
              gameSocialMode === 'escape'
                ? 'bg-white border-school-primary ring-2 ring-school-primary/20 shadow-sm text-school-primary'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${gameSocialMode === 'escape' ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Escape-Game</div>
              <div className="text-[10px] text-slate-500">4-stelliger Tresorcode</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. DIDAKTISCHE SCHÄRFUNG & THEMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* FEHLKONZEPT TOGGLE */}
        <div 
          onClick={() => onMisconceptionsToggle(!includeMisconceptions)}
          className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
            includeMisconceptions 
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 ring-1 ring-emerald-300' 
              : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="pt-0.5">
            <input
              type="checkbox"
              checked={includeMisconceptions}
              onChange={e => onMisconceptionsToggle(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
          <div className="text-xs">
            <div className="font-bold flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-emerald-700" />
              Schülerfallen einbauen
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              KI nutzt typische Fehlkonzepte als falsche Antwortoptionen.
            </p>
          </div>
        </div>

        {/* STORYTELLING THEME */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Rahmengeschichte:
          </label>
          <select
            value={gameStoryTheme}
            onChange={e => onStoryThemeChange(e.target.value as GameStoryTheme)}
            className="w-full text-base sm:text-xs font-semibold px-2.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
          >
            <option value="neutral">Klassisch / Neutral (Keine Story)</option>
            <option value="detective">🔍 Detektiv-Fall (Spurensuche)</option>
            <option value="space">🚀 Weltraum-Expedition</option>
            <option value="alchemy">🧪 Labor-Rettung (Gefahrgut)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
