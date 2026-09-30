import React, { useState, useMemo } from 'react';
import { Table, CheckSquare, Award, Printer, Download, Sparkles, Edit3, Eye, Calculator, Sliders, Info } from 'lucide-react';
import { downloadFile } from '../../services/exportService';
import { calculateHbsGradeTable, getGradeForPoints, HBS_GRADE_CONFIG } from '../../data/hbsNotenschluessel';

interface TabRubricAssessmentProps {
  rubricMarkdown: string;
  topicTitle: string;
  subjectName: string;
  gradeLevel: number;
  onRubricChange?: (updatedMarkdown: string) => void;
}

export const TabRubricAssessment: React.FC<TabRubricAssessmentProps> = ({
  rubricMarkdown,
  topicTitle,
  subjectName,
  gradeLevel,
  onRubricChange
}) => {
  // Edit mode for markdown
  const [isEditing, setIsEditing] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState(rubricMarkdown);

  // Sync when rubricMarkdown prop changes (if not in active edit)
  React.useEffect(() => {
    setEditableMarkdown(rubricMarkdown);
  }, [rubricMarkdown]);

  // Total points for HBS calculation
  const [totalPoints, setTotalPoints] = useState<number>(20);
  const [testPoints, setTestPoints] = useState<number>(18);

  const gradeTable = useMemo(() => {
    return calculateHbsGradeTable(totalPoints);
  }, [totalPoints]);

  const studentGrade = useMemo(() => {
    return getGradeForPoints(testPoints, totalPoints);
  }, [testPoints, totalPoints]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadFile(editableMarkdown, `${subjectName}_Kl${gradeLevel}_Bewertungsraster.md`, 'text/markdown;charset=utf-8');
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onRubricChange) {
      onRubricChange(editableMarkdown);
    }
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Award className="w-4 h-4 text-school-primary" />
          <span>Erwartungshorizont & Bewertungsraster (ThILLM & HBS-Notenschlüssel)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setIsEditing(true);
              }
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              isEditing
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditing ? 'Vorschau & Übernehmen' : 'Raster anpassen'}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            title="Als Markdown-Datei herunterladen"
          >
            <Download className="w-3.5 h-3.5" />
            Raster (.md)
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-school-primary text-white text-xs font-bold rounded-xl hover:bg-school-primaryDark transition flex items-center gap-1.5 shadow-sm"
            title="Druckt ausschließlich das Bewertungsblatt ohne Navigationsleisten im sauberen DIN-A4-Format"
          >
            <Printer className="w-3.5 h-3.5" />
            Drucken / PDF
          </button>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS FOR NOTENTABELLE (PRINT HIDDEN) */}
      <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 p-4 rounded-2xl border border-blue-200 shadow-soft space-y-3 print:hidden">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-950">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Offizieller HBS Notenschlüssel-Konfigurator (Heimbürgeschule Kahla)</span>
          </div>
          <div className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Offizielle Schwellenwerte: 95% • 80% • 65% • 45% • 25%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* MAX POINTS SELECTOR */}
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs">
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5">
              Gesamtpunktzahl der Leistungsmessung / Station:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="200"
                value={totalPoints}
                onChange={e => setTotalPoints(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-primary"
              />
              <span className="text-xs font-bold text-slate-600">Punkte gesamt</span>

              {/* QUICK CHIPS */}
              <div className="flex items-center gap-1 ml-auto">
                {[15, 20, 25, 30, 50].map(pts => (
                  <button
                    key={pts}
                    onClick={() => setTotalPoints(pts)}
                    className={`px-2 py-1 text-[10px] font-extrabold rounded-md transition ${
                      totalPoints === pts
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pts} P.
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STUDENT QUICK GRADE CALCULATOR */}
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs flex items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                <Calculator className="w-3.5 h-3.5 inline mr-1 text-school-primary" />
                Schnellrechner für Schülerarbeit:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={totalPoints}
                  value={testPoints}
                  onChange={e => setTestPoints(Math.min(totalPoints, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-primary"
                />
                <span className="text-[11px] text-slate-500 font-semibold">von {totalPoints} P.</span>
                <span className="text-[11px] font-black text-slate-700">
                  ({Math.round((testPoints / totalPoints) * 100)}%)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Note</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xl font-black text-slate-900">{studentGrade.grade}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${studentGrade.colorBadge}`}>
                  {studentGrade.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MARKDOWN EDITOR (IF EDITING) */}
      {isEditing && (
        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-soft p-4 print:hidden animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              Bewertungsraster direkt bearbeiten (Markdown-Format):
            </span>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg shadow-sm"
            >
              Änderungen übernehmen
            </button>
          </div>
          <textarea
            value={editableMarkdown}
            onChange={e => setEditableMarkdown(e.target.value)}
            rows={12}
            className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            Tipp: Tabellenzeilen werden mit <code>| Kriterium | Erwartung | Punkte |</code> aufgebaut.
          </p>
        </div>
      )}

      {/* RUBRIC DOCUMENT CONTAINER (PRINTABLE TARGET) */}
      <div 
        id="printable-rubric" 
        className="printable-sheet bg-white rounded-2xl border border-slate-200 shadow-float p-6 sm:p-10 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full"
      >
        {/* HEADER */}
        <div className="border-b-2 border-school-primary pb-4 mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-school-primary">
            Erwartungshorizont & Bewertungsbogen
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {topicTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {subjectName} • Klassenstufe {gradeLevel} • Thüringer Regelschulstandard • Max. {totalPoints} Punkte
          </p>
        </div>

        {/* RAW OR FORMATTED RUBRIC CONTENT */}
        <div 
          className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4 rubric-table-container"
          dangerouslySetInnerHTML={{
            __html: formatRubricHtml(editableMarkdown)
          }}
        />

        {/* OFFIZIELLER HEIMBÜRGESCHULE NOTENSCHLÜSSEL TABELLE */}
        <div className="mt-8 pt-6 border-t border-slate-200 break-inside-avoid">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-school-primary" />
              Notenschlüssel Heimbürgeschule Kahla (Gesamt: {totalPoints} P.):
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold print:text-[9px]">
              Offizielle HBS-Schwellenwerte
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            {gradeTable.map(gt => (
              <div 
                key={gt.grade}
                className={`border rounded-xl p-2.5 flex flex-col justify-between ${
                  gt.grade === 1 ? 'bg-emerald-50/80 border-emerald-200' :
                  gt.grade === 2 ? 'bg-teal-50/80 border-teal-200' :
                  gt.grade === 3 ? 'bg-blue-50/80 border-blue-200' :
                  gt.grade === 4 ? 'bg-amber-50/80 border-amber-200' :
                  gt.grade === 5 ? 'bg-orange-50/80 border-orange-200' :
                  'bg-rose-50/80 border-rose-200'
                }`}
              >
                <div>
                  <div className="font-black text-slate-900 text-sm">Note {gt.grade}</div>
                  <div className="text-[11px] font-bold text-slate-600 mb-1">{gt.name}</div>
                </div>

                <div className="mt-1 pt-1.5 border-t border-slate-200/60">
                  <div className="text-xs font-black text-school-primary">
                    {gt.minPoints === gt.maxPoints
                      ? `${gt.minPoints} P.`
                      : `${gt.minPoints} – ${gt.maxPoints} P.`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {gt.grade === 1
                      ? 'ab 95%'
                      : gt.grade === 6
                      ? '< 25%'
                      : `${gt.minPercent}% – ${gt.maxPercent}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK & FÖRDERHINWEISE BOX */}
        <div className="mt-8 border border-slate-300 rounded-xl p-4 bg-slate-50 break-inside-avoid">
          <div className="text-xs font-bold text-slate-800 mb-2">
            Individuelle Rückmeldung & Förderempfehlung für die Schülerin / den Schüler:
          </div>
          <div className="h-16 border-b border-dashed border-slate-300"></div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
            <span>Datum: _________________</span>
            <span>Unterschrift Fachlehrkraft: ___________________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatRubricHtml(markdown: string): string {
  // Convert markdown tables and headers to clean HTML
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-extrabold text-slate-900 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base font-black text-school-primary mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\|(.+)\|/gim, (match) => {
      const cells = match.split('|').filter(c => c.trim().length > 0);
      if (cells.some(c => c.includes('---'))) {
        return ''; // delimiter row
      }
      return `<tr class="border-b border-slate-200">${cells.map(c => `<td class="p-2 border border-slate-200 text-xs">${c.trim()}</td>`).join('')}</tr>`;
    });

  if (html.includes('<tr')) {
    html = `<table class="w-full border-collapse border border-slate-200 my-4 text-left">${html}</table>`;
  }

  return html;
}
