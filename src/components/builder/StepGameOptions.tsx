import React from 'react';
import { 
  Gamepad2, 
  Layers, 
  ArrowDownUp, 
  User, 
  Users2, 
  KeyRound, 
  Sparkles,
  Brain,
  PenTool,
  AlertTriangle
} from 'lucide-react';
import { GameMode, GameSocialMode, GameStoryTheme } from '../../types/generator';

interface StepGameOptionsProps {
  gameMode: GameMode;
  gameSocialMode: GameSocialMode;
  includeMisconceptions: boolean;
  customMisconceptions: string;
  gameStoryTheme: GameStoryTheme;
  customStoryTheme: string;
  onGameModeChange: (mode: GameMode) => void;
  onSocialModeChange: (mode: GameSocialMode) => void;
  onMisconceptionsToggle: (enabled: boolean) => void;
  onCustomMisconceptionsChange: (val: string) => void;
  onStoryThemeChange: (theme: GameStoryTheme) => void;
  onCustomStoryThemeChange: (val: string) => void;
}

export const StepGameOptions: React.FC<StepGameOptionsProps> = ({
  gameMode,
  gameSocialMode,
  includeMisconceptions,
  customMisconceptions,
  gameStoryTheme,
  customStoryTheme,
  onGameModeChange,
  onSocialModeChange,
  onMisconceptionsToggle,
  onCustomMisconceptionsChange,
  onStoryThemeChange,
  onCustomStoryThemeChange
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

      {/* 3. DIDAKTISCHE SCHÄRFUNG & HYBRIDES STORYTELLING */}
      <div className="space-y-3 pt-1">
        {/* STORYTELLING / RAHMENHANDLUNG */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Rahmenhandlung & Storytelling:
            </span>
            <span className="text-[10px] font-normal text-slate-400">Presets + Freitext</span>
          </label>

          <select
            value={gameStoryTheme}
            onChange={e => onStoryThemeChange(e.target.value as GameStoryTheme)}
            className="w-full text-base sm:text-xs font-semibold px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800 mb-2"
          >
            <option value="neutral">Klassisch / Fachlich (Keine fiktive Story)</option>
            <option value="detective">🔍 Detektiv-Fall (Spurensuche & Täter entlarven)</option>
            <option value="space">🚀 Weltraum-Expedition (Raumschiff-Rettung)</option>
            <option value="alchemy">🧪 Labor-Rettung (Gefahrgut neutralisieren)</option>
            <option value="custom">✨ Eigene Rahmenhandlung eingeben...</option>
          </select>

          {/* FREITEXTFELD FÜR EIGENE RAHMENGESCHICHTE */}
          {gameStoryTheme === 'custom' && (
            <div className="animate-fadeIn pt-1">
              <div className="relative">
                <PenTool className="w-3.5 h-3.5 absolute left-3 top-3 text-school-primary" />
                <input
                  type="text"
                  value={customStoryTheme}
                  onChange={e => onCustomStoryThemeChange(e.target.value)}
                  placeholder="z. B. Flucht aus der Porzellanfabrik Kahla, Zeitreise ins antike Rom, Bienenkönigin im Schulgarten retten..."
                  className="w-full text-base sm:text-xs pl-8 pr-3 py-2 bg-sky-50/50 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Die KI verwebt deine Geschichte in die Fragestellungen, Erfolgsmeldungen und Zwischentexte.
              </p>
            </div>
          )}
        </div>

        {/* FEHLKONZEPTE & SCHÜLERFALLEN */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div 
            onClick={() => onMisconceptionsToggle(!includeMisconceptions)}
            className="flex items-start gap-2.5 cursor-pointer select-none"
          >
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={includeMisconceptions}
                onChange={e => onMisconceptionsToggle(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-slate-800">
                <Brain className="w-3.5 h-3.5 text-emerald-600" />
                Schüler-Fehlkonzepte & Stolperfallen gezielt einbauen
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Falsche Antwortmöglichkeiten basieren auf echten Missverständnissen der Klassenstufe.
              </p>
            </div>
          </div>

          {/* FREITEXTFELD FÜR SPEZIFISCHE FEHLVORSTELLUNGEN */}
          {includeMisconceptions && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 animate-fadeIn">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Spezifische Stolperfalle / Typischen Denkfehler vorgeben (Optional):
              </label>
              <input
                type="text"
                value={customMisconceptions}
                onChange={e => onCustomMisconceptionsChange(e.target.value)}
                placeholder="z. B. Radius und Durchmesser verwechseln, Punkt vor Strich vergessen, Masse = Gewicht..."
                className="w-full text-base sm:text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
