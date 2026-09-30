import React, { useState } from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  PenTool, 
  Award, 
  Compass, 
  CheckSquare, 
  MessageSquare,
  Sparkles,
  Lightbulb,
  Sliders,
  Video,
  Shuffle
} from 'lucide-react';
import { 
  StationModulesConfig, 
  StationSpecialType, 
  StationCustomizationConfig 
} from '../../types/generator';

interface StepStationOptionsProps {
  stationModules: StationModulesConfig;
  stationSpecialType: StationSpecialType;
  stationInclusionTipps: boolean;
  stationCustomization: StationCustomizationConfig;
  onModulesChange: (modules: StationModulesConfig) => void;
  onSpecialTypeChange: (type: StationSpecialType) => void;
  onInclusionTippsToggle: (enabled: boolean) => void;
  onCustomizationChange: (customization: StationCustomizationConfig) => void;
}

export const StepStationOptions: React.FC<StepStationOptionsProps> = ({
  stationModules,
  stationSpecialType,
  stationInclusionTipps,
  stationCustomization,
  onModulesChange,
  onSpecialTypeChange,
  onInclusionTippsToggle,
  onCustomizationChange
}) => {
  const [showAdvancedParams, setShowAdvancedParams] = useState(true);

  const toggleModule = (key: keyof StationModulesConfig) => {
    onModulesChange({
      ...stationModules,
      [key]: !stationModules[key]
    });
  };

  const updateParam = <K extends keyof StationCustomizationConfig>(
    key: K, 
    value: StationCustomizationConfig[K]
  ) => {
    onCustomizationChange({
      ...stationCustomization,
      [key]: value
    });
  };

  const moduleItems: { key: keyof StationModulesConfig; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      key: 'goals',
      title: '1. Lernziel-Checkliste',
      subtitle: 'Interaktives Abhaken durch Schüler',
      icon: <CheckCircle className="w-4 h-4 text-school-primary" />
    },
    {
      key: 'knowledge',
      title: '2. Wissensbereich & Merkkästen',
      subtitle: 'Strukturierte Fachtexte mit Zwischenüberschriften',
      icon: <BookOpen className="w-4 h-4 text-school-secondary" />
    },
    {
      key: 'flashcards',
      title: '3. 3D-Lernkarten (Begriffe)',
      subtitle: `${stationCustomization.flashcardCount || 6} Karten zum Umdrehen per Klick`,
      icon: <Layers className="w-4 h-4 text-purple-600" />
    },
    {
      key: 'cloze',
      title: '4. Interaktiver Lückentext',
      subtitle: `${stationCustomization.clozeHoleCount || 5} Lücken ${stationCustomization.clozeWithWordBank ? '(mit Wortspeicher)' : ''}`,
      icon: <PenTool className="w-4 h-4 text-blue-600" />
    },
    {
      key: 'afbTasks',
      title: '5. Differenzierte Aufgaben',
      subtitle: `${stationCustomization.afb1TaskCount + stationCustomization.afb2TaskCount + stationCustomization.afb3TaskCount} Aufgaben (AFB I–III mit Klapp-Tipps)`,
      icon: <Award className="w-4 h-4 text-amber-600" />
    },
    {
      key: 'specialModule',
      title: '6. Fach-Spezialstation',
      subtitle: 'Zeitstrahl, Entdecker- oder Experimentier-Station',
      icon: <Compass className="w-4 h-4 text-emerald-600" />
    },
    {
      key: 'quiz',
      title: '7. Wissens-Check Quiz',
      subtitle: `${stationCustomization.quizQuestionCount || 6} MC-Fragen mit gemischten Antworten`,
      icon: <CheckSquare className="w-4 h-4 text-rose-600" />
    },
    {
      key: 'reflection',
      title: '8. Reflexion & Selbsteinschätzung',
      subtitle: `Feedback & ${stationCustomization.youtubeLinkCount || 3} YouTube-Suchlinks`,
      icon: <MessageSquare className="w-4 h-4 text-indigo-600" />
    }
  ];

  return (
    <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-sky-200/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-school-primary text-white rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-school-primaryDark uppercase tracking-wider">
              Lernstations-Architektur konfigurieren
            </h3>
            <p className="text-[11px] text-slate-500">
              Wähle die interaktiven Bausteine für die Schüler-Website
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedParams(!showAdvancedParams)}
          className="text-xs font-bold text-school-primary hover:text-school-primaryDark flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200/80 transition"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvancedParams ? 'Weniger Details' : 'Feinjustierung'}</span>
        </button>
      </div>

      {/* MODULE SELECTION TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {moduleItems.map(item => {
          const isChecked = stationModules[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleModule(item.key)}
              className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 ${
                isChecked
                  ? 'bg-white border-school-primary ring-1 ring-school-primary/30 shadow-xs'
                  : 'bg-white/60 border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // handled by button onClick
                className="mt-0.5 w-4 h-4 rounded text-school-primary accent-school-primary shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FEINJUSTIERUNG: DYNAMISCHE PARAMETER */}
      {showAdvancedParams && (
        <div className="bg-white/90 border border-sky-200/90 rounded-xl p-3.5 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-school-primary" />
              Inhaltliche Feinjustierung des Prompts:
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Shuffle className="w-3 h-3" />
              Anti-A-Bias aktiv
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. ANZAHL LERNKARTEN */}
            {stationModules.flashcards && (
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>🃏 Anzahl Lernkarten:</span>
                  <span className="text-school-primary font-black">{stationCustomization.flashcardCount} Karten</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[4, 6, 8, 10, 12].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateParam('flashcardCount', n)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold transition border ${
                        stationCustomization.flashcardCount === n
                          ? 'bg-school-primary text-white border-school-primary'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. LÜCKENTEXT PARAMETER */}
            {stationModules.cloze && (
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>📝 Lücken im Text:</span>
                  <span className="text-school-primary font-black">{stationCustomization.clozeHoleCount} Lücken</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[3, 5, 7, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateParam('clozeHoleCount', n)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold transition border ${
                        stationCustomization.clozeHoleCount === n
                          ? 'bg-school-primary text-white border-school-primary'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 pt-1 border-t border-slate-200/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stationCustomization.clozeWithWordBank}
                    onChange={e => updateParam('clozeWithWordBank', e.target.checked)}
                    className="w-4 h-4 rounded text-school-primary accent-school-primary"
                  />
                  <span className="text-[11px] font-bold text-slate-700">
                    💡 Wortspeicher-Kasten über Text einblenden
                  </span>
                </label>
              </div>
            )}

            {/* 3. QUIZ PARAMETER MIT ZUFALLS-ANTWORTEN */}
            {stationModules.quiz && (
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>❓ Anzahl Quizfragen:</span>
                  <span className="text-school-primary font-black">{stationCustomization.quizQuestionCount} Fragen</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[4, 6, 8, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateParam('quizQuestionCount', n)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold transition border ${
                        stationCustomization.quizQuestionCount === n
                          ? 'bg-school-primary text-white border-school-primary'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <span>🎲</span> Richtige Antworten werden gemischt (nie nur A).
                </p>
              </div>
            )}

            {/* 4. YOUTUBE LINKS ANZAHL */}
            {stationModules.reflection && (
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-800">
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                    YouTube-Suchlinks:
                  </span>
                  <span className="text-school-primary font-black">{stationCustomization.youtubeLinkCount} Links</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateParam('youtubeLinkCount', n)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold transition border ${
                        stationCustomization.youtubeLinkCount === n
                          ? 'bg-school-primary text-white border-school-primary'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. DIFFERENZIERTE AUFGABEN PRO AFB */}
          {stationModules.afbTasks && (
            <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                🎯 Anzahl Aufgaben pro Anforderungsbereich (AFB I–III):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-extrabold text-emerald-900 block truncate">🟢 AFB I (Basis)</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[1, 2, 3].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateParam('afb1TaskCount', c)}
                        className={`w-6 h-6 rounded text-[11px] font-bold transition ${
                          stationCustomization.afb1TaskCount === c
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-extrabold text-amber-900 block truncate">🟡 AFB II (Regel)</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[1, 2, 3].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateParam('afb2TaskCount', c)}
                        className={`w-6 h-6 rounded text-[11px] font-bold transition ${
                          stationCustomization.afb2TaskCount === c
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-extrabold text-rose-900 block truncate">🔴 AFB III (Experte)</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[1, 2, 3].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateParam('afb3TaskCount', c)}
                        className={`w-6 h-6 rounded text-[11px] font-bold transition ${
                          stationCustomization.afb3TaskCount === c
                            ? 'bg-rose-600 text-white'
                            : 'bg-white text-rose-800 border border-rose-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INCLUSION TIP BOXEN TOGGLE */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <span>„Paul & Leon“-Inklusions-Hilfen</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-extrabold">DaZ / Fördern</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Fügt zu jedem Abschnitt einfache 💡 Tipp-Boxen in Leichter Sprache hinzu.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={stationInclusionTipps}
          onChange={e => onInclusionTippsToggle(e.target.checked)}
          className="w-5 h-5 rounded text-amber-600 accent-amber-600 shrink-0 cursor-pointer"
        />
      </div>

      {/* SPECIAL MODULE SELECTOR */}
      {stationModules.specialModule && (
        <div className="pt-2 border-t border-sky-200/60">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-school-primary" />
            Fokus der Spezialstation (Station 6):
          </label>
          <select
            value={stationSpecialType}
            onChange={e => onSpecialTypeChange(e.target.value as StationSpecialType)}
            className="w-full text-base sm:text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-primary shadow-xs"
          >
            <option value="auto">Automatisch passend zum Fach (Empfohlen)</option>
            <option value="timeline">Interaktiver Zeitstrahl & Chronologie (Geschichte / Geografie)</option>
            <option value="detective">Quellen- & Fund-Detektiv (Archäologie / Literatur)</option>
            <option value="experiment">Virtuelle Versuchs- & Laborstation (Naturwissenschaften)</option>
          </select>
        </div>
      )}
    </div>
  );
};
