import React from 'react';
import { HeartHandshake, Volume2, BookA, Clock, Sparkles } from 'lucide-react';

interface StepInclusionDazProps {
  inclusionMode: boolean;
  targetDurationMinutes: number;
  additionalInstructions: string;
  onInclusionToggle: (enabled: boolean) => void;
  onDurationChange: (minutes: number) => void;
  onAdditionalInstructionsChange: (text: string) => void;
}

export const StepInclusionDaz: React.FC<StepInclusionDazProps> = ({
  inclusionMode,
  targetDurationMinutes,
  additionalInstructions,
  onInclusionToggle,
  onDurationChange,
  onAdditionalInstructionsChange
}) => {
  return (
    <div className="space-y-4 pt-2 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-school-primary text-white text-[11px] font-bold flex items-center justify-center">4</span>
          Inklusion, DaZ & Rahmenbedingungen
        </label>
        <span className="text-[11px] font-semibold text-school-secondary">Barrierefreiheit</span>
      </div>

      {/* FÖRDERMODUS TOGGLE CARD */}
      <div 
        onClick={() => onInclusionToggle(!inclusionMode)}
        className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
          inclusionMode
            ? 'bg-school-secondaryLight/50 border-school-secondary ring-2 ring-school-secondary/20 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={inclusionMode}
            onChange={e => onInclusionToggle(e.target.checked)}
            className="w-5 h-5 text-school-secondary rounded border-slate-300 focus:ring-school-secondary cursor-pointer"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-school-secondary" />
              Inklusions- & DaZ-Fördermodus aktivieren
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              inclusionMode ? 'bg-school-secondary text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {inclusionMode ? 'Aktiviert' : 'Optional'}
            </span>
          </div>
          
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Generiert einen automatischen <strong>Fach-Wortspeicher</strong> (Erklärungen in einfacher Sprache), nutzt sprachsensible Satzstrukturen und aktiviert die <strong>Vorlesefunktion</strong> im HTML-Lernspiel.
          </p>

          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              <BookA className="w-3.5 h-3.5 text-school-secondary" /> Leichte Sprache & Wortspeicher
            </span>
            <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              <Volume2 className="w-3.5 h-3.5 text-school-secondary" /> Audio-Vorleser im Lernspiel
            </span>
          </div>
        </div>
      </div>

      {/* DURATION & EXTRA INSTRUCTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Unterrichtsdauer
          </label>
          <select
            value={targetDurationMinutes}
            onChange={e => onDurationChange(Number(e.target.value))}
            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
          >
            <option value={20}>20 Minuten (Kurztest / Einstieg)</option>
            <option value={45}>45 Minuten (Einzelstunde)</option>
            <option value={90}>90 Minuten (Doppelstunde)</option>
            <option value={135}>135 Minuten (Projekttag)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Zusätzliche didaktische Hinweise (Optional)
          </label>
          <input
            type="text"
            value={additionalInstructions}
            onChange={e => onAdditionalInstructionsChange(e.target.value)}
            placeholder="z.B. Für Partnerarbeit konzipieren, mit Beispielen aus Thüringen..."
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
};
