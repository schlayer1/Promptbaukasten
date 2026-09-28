import React from 'react';
import { Table, CheckSquare, Award, Printer, Download, Sparkles } from 'lucide-react';
import { downloadFile } from '../../services/exportService';

interface TabRubricAssessmentProps {
  rubricMarkdown: string;
  topicTitle: string;
  subjectName: string;
  gradeLevel: number;
}

export const TabRubricAssessment: React.FC<TabRubricAssessmentProps> = ({
  rubricMarkdown,
  topicTitle,
  subjectName,
  gradeLevel
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadFile(rubricMarkdown, `${subjectName}_Kl${gradeLevel}_Bewertungsraster.md`, 'text/markdown;charset=utf-8');
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Award className="w-4 h-4 text-school-primary" />
          <span>Erwartungshorizont & Kriterienmatrix nach ThILLM</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Raster (.md)
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-school-primary text-white text-xs font-bold rounded-xl hover:bg-school-primaryDark transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Drucken / PDF
          </button>
        </div>
      </div>

      {/* RUBRIC DOCUMENT CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-float p-6 sm:p-10 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
        {/* HEADER */}
        <div className="border-b-2 border-school-primary pb-4 mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-school-primary">
            Erwartungshorizont & Bewertungsbogen
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {topicTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {subjectName} • Klassenstufe {gradeLevel} • Thüringer Regelschulstandard
          </p>
        </div>

        {/* RAW OR FORMATTED RUBRIC CONTENT */}
        <div 
          className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4 rubric-table-container"
          dangerouslySetInnerHTML={{
            __html: formatRubricHtml(rubricMarkdown)
          }}
        />

        {/* THÜRINGER NOTENSCHLÜSSEL TABELLE */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-school-primary" />
            Thüringer Regelschul-Notenschlüssel (Orientierung):
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="font-extrabold text-emerald-900">Sehr gut (1)</div>
              <div className="text-emerald-700 text-[11px] font-semibold">100% – 95%</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="font-extrabold text-emerald-900">Gut (2)</div>
              <div className="text-emerald-700 text-[11px] font-semibold">94% – 80%</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="font-extrabold text-blue-900">Befriedigend (3)</div>
              <div className="text-blue-700 text-[11px] font-semibold">79% – 65%</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
              <div className="font-extrabold text-amber-900">Ausreichend (4)</div>
              <div className="text-amber-700 text-[11px] font-semibold">64% – 50%</div>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2">
              <div className="font-extrabold text-rose-900">Mangelhaft (5)</div>
              <div className="text-rose-700 text-[11px] font-semibold">49% – 25%</div>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2">
              <div className="font-extrabold text-rose-900">Ungenügend (6)</div>
              <div className="text-rose-700 text-[11px] font-semibold">&lt; 25%</div>
            </div>
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
