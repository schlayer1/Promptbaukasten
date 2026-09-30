import React from 'react';
import { BookOpen, Layers, CheckCircle2, PenTool } from 'lucide-react';
import { GradeLevel } from '../../types/curriculum';
import { THUERINGEN_SUBJECTS, SUBJECT_CATEGORIES, getDoubleGrade } from '../../data/thueringenCurriculum';

interface StepCurriculumSelectProps {
  subjectId: string;
  gradeLevel: GradeLevel;
  topicId: string;
  customTopicDetail: string;
  onSubjectChange: (id: string) => void;
  onGradeChange: (grade: GradeLevel) => void;
  onTopicChange: (topicId: string) => void;
  onCustomDetailChange: (detail: string) => void;
}

export const StepCurriculumSelect: React.FC<StepCurriculumSelectProps> = ({
  subjectId,
  gradeLevel,
  topicId,
  customTopicDetail,
  onSubjectChange,
  onGradeChange,
  onTopicChange,
  onCustomDetailChange
}) => {
  const selectedSubject = THUERINGEN_SUBJECTS.find(s => s.id === subjectId) || THUERINGEN_SUBJECTS[0];
  const allowedGrades = selectedSubject.allowedGrades;
  const currentDoubleGrade = getDoubleGrade(gradeLevel);

  // Filter topics for the current double grade level
  const applicableTopics = selectedSubject.topics.filter(t => t.doubleGrade === currentDoubleGrade);
  const currentTopic = applicableTopics.find(t => t.id === topicId) || applicableTopics[0] || selectedSubject.topics[0];

  return (
    <div className="space-y-4 pt-2 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-school-primary text-white text-[11px] font-bold flex items-center justify-center">2</span>
          Fach, Klasse & Lehrplanthema (ThILLM)
        </label>
        <span className="text-[11px] font-semibold text-school-primary">
          {gradeLevel.includes('/') ? `Doppelstufe ${gradeLevel}` : `Klasse ${gradeLevel}`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* FACH AUSWAHL */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Unterrichtsfach
          </label>
          <select
            value={subjectId}
            onChange={e => onSubjectChange(e.target.value)}
            className="w-full text-base sm:text-xs font-semibold px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary transition text-slate-800 shadow-sm"
          >
            {SUBJECT_CATEGORIES.map(cat => {
              const subjectsInCat = THUERINGEN_SUBJECTS.filter(s => s.category === cat.category);
              if (subjectsInCat.length === 0) return null;
              return (
                <optgroup key={cat.category} label={`── ${cat.label} ──`}>
                  {subjectsInCat.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.allowedGrades[0]}–{s.allowedGrades[s.allowedGrades.length - 1]})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {/* KLASSENSTUFE */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Klassenstufe
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {allowedGrades.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => onGradeChange(g)}
                className={`flex-1 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition ${
                  gradeLevel === g
                    ? 'bg-school-primary text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* THILLM LEHRPLAN THEMA */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span>ThILLM-Lernbereich / Lehrplanthema</span>
          <span className="text-[11px] font-normal text-slate-400">
            {gradeLevel.includes('/') ? `Doppelstufe ${gradeLevel}` : `Jahrgang ${gradeLevel}`}
          </span>
        </label>
        
        {applicableTopics.length > 0 ? (
          <select
            value={currentTopic?.id || ''}
            onChange={e => onTopicChange(e.target.value)}
            className="w-full text-base sm:text-xs font-semibold px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary transition text-slate-800 shadow-sm"
          >
            {applicableTopics.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        ) : (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-200">
            Für diese Klassenstufe ist im Baukasten ein freies Thema vorgesehen. Bitte trage unten deine Konkretisierung ein.
          </div>
        )}
      </div>

      {/* KERNKOMPETENZEN ANZEIGE */}
      {currentTopic && currentTopic.coreCompetencies.length > 0 && (
        <div className="bg-school-surfaceContainer p-3 rounded-xl border border-school-border/60">
          <div className="text-[11px] font-bold text-school-primary mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Kernkompetenzen nach ThILLM-Lehrplan:
          </div>
          <ul className="space-y-1">
            {currentTopic.coreCompetencies.map((comp, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                <span className="text-school-secondary font-bold">•</span>
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* INDIVIDUELLE KONKRETISIERUNG */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-school-primary" />
          Eigene Konkretisierung / Spezifischer Unterrichtsfokus (Optional)
        </label>
        <input
          type="text"
          value={customTopicDetail}
          onChange={e => onCustomDetailChange(e.target.value)}
          placeholder="z. B. Schwerpunkt auf Experimente zur Fotosynthese, Textabschnitt Zeile 14-48, Stationenlernen..."
          className="w-full text-base sm:text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary transition placeholder:text-slate-400 text-slate-800 shadow-sm"
        />
      </div>
    </div>
  );
};
