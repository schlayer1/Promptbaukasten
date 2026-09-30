import React, { useState, useEffect } from 'react';
import { Printer, Eye, EyeOff, BookA, QrCode, FileText, Download, CheckCircle2 } from 'lucide-react';
import { generateQrCodeDataUrl, downloadFile } from '../../services/exportService';

interface TabWorksheetPrintProps {
  worksheetMarkdown: string;
  vocabulary: { term: string; explanation: string }[];
  subjectName: string;
  gradeLevel: number;
  topicTitle: string;
  inclusionMode: boolean;
}

export const TabWorksheetPrint: React.FC<TabWorksheetPrintProps> = ({
  worksheetMarkdown,
  vocabulary,
  subjectName,
  gradeLevel,
  topicTitle,
  inclusionMode
}) => {
  const [showSolutions, setShowSolutions] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    generateQrCodeDataUrl(window.location.href).then(setQrCodeUrl);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const filename = `${subjectName}_Kl${gradeLevel}_Arbeitsblatt.md`;
    downloadFile(worksheetMarkdown, filename, 'text/markdown;charset=utf-8');
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              showSolutions
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {showSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSolutions ? 'Lösungen ausblenden (Schüler)' : 'Lösungen einblenden (Lehrkraft)'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Markdown (.md)
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-school-primary text-white text-xs font-bold rounded-xl hover:bg-school-primaryDark transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Drucken / Als PDF speichern
          </button>
        </div>
      </div>

      {/* PRINT-OPTIMIZED DIN-A4 SHEET */}
      <div 
        id="printable-worksheet"
        className="printable-sheet bg-white rounded-2xl border border-slate-200 shadow-float p-6 sm:p-10 max-w-4xl xl:max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full"
      >
        
        {/* DIN-A4 SCHULISCHER KOPF */}
        <div className="border-b-2 border-school-primary pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-school-primary">
                Staatliche Regelschule Heimbürgeschule Kahla
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {topicTitle}
              </h2>
              <div className="text-xs text-slate-600 mt-0.5 font-medium">
                Fach: <strong className="text-slate-900">{subjectName}</strong> • Klassenstufe: <strong className="text-slate-900">{gradeLevel}</strong> • Differenziertes Arbeitsblatt
              </div>
            </div>

            {/* QR-CODE BOX IN HEADER */}
            {qrCodeUrl && (
              <div className="hidden sm:flex flex-col items-center pl-4 border-l border-slate-200 shrink-0">
                <img src={qrCodeUrl} alt="Lernspiel QR" className="w-16 h-16 rounded" />
                <span className="text-[9px] text-slate-500 font-bold mt-1 text-center leading-tight">
                  Lernspiel<br />scannen
                </span>
              </div>
            )}
          </div>

          {/* NAME / DATUM LEISTE */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-dashed border-slate-200 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 font-semibold">Name:</span> ___________________________
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Klasse:</span> ___________
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Datum:</span> ___________________
            </div>
          </div>
        </div>

        {/* WORTSPEICHER BOX (FÜR DaZ & FÖRDERBEDARF) */}
        {(inclusionMode || vocabulary.length > 0) && (
          <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4 mb-6 text-xs text-slate-800 break-inside-avoid">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-900 text-xs uppercase tracking-wider mb-2">
              <BookA className="w-4 h-4 text-amber-700" />
              Wortspeicher & Fachbegriffe (Einfache Sprache):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vocabulary.length > 0 ? (
                vocabulary.map((v, i) => (
                  <div key={i} className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <strong className="text-school-primary">{v.term}:</strong> {v.explanation}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-slate-500 italic">
                  Fachbegriffe und Sprachhilfen sind direkt in den Aufgaben integriert.
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKSHEET CONTENT / AUFGABENBLÖCKE */}
        <div className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4 font-normal">
          {worksheetMarkdown ? (
            <div 
              className="worksheet-render space-y-4"
              dangerouslySetInnerHTML={{
                __html: formatWorksheetHtml(worksheetMarkdown, showSolutions)
              }}
            />
          ) : (
            <p className="text-slate-400 italic">Noch kein Arbeitsblatt generiert.</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>Staatliche Regelschule Kahla • Thüringer Lehrplan (ThILLM)</span>
          <span>KMK-Anforderungsbereiche I (Basis), II (Erweitert), III (Vertieft)</span>
        </div>
      </div>
    </div>
  );
};

function formatWorksheetHtml(markdown: string, showSolutions: boolean): string {
  // Simple clean markdown-to-html formatter for school worksheets
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-black text-school-primary mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-slate-900 mt-4 mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '</p><p class="mb-2">')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

  // Highlight Level Badges cleanly without duplicate nested brackets
  html = html.replace(/NIVEAU GRÜN(?:\s*\(\s*AFB I\s*[-–]?\s*([^)]*)\))?/gi, (_, extra) => {
    return `<span class="inline-block bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-lg text-xs font-bold mr-1">NIVEAU GRÜN (AFB I)</span>${extra ? ' – ' + extra.trim() : ''}`;
  });
  html = html.replace(/NIVEAU GELB(?:\s*\(\s*AFB II\s*[-–]?\s*([^)]*)\))?/gi, (_, extra) => {
    return `<span class="inline-block bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-lg text-xs font-bold mr-1">NIVEAU GELB (AFB II)</span>${extra ? ' – ' + extra.trim() : ''}`;
  });
  html = html.replace(/NIVEAU ROT(?:\s*\(\s*AFB III\s*[-–]?\s*([^)]*)\))?/gi, (_, extra) => {
    return `<span class="inline-block bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-lg text-xs font-bold mr-1">NIVEAU ROT (AFB III)</span>${extra ? ' – ' + extra.trim() : ''}`;
  });

  // Solution block handling
  if (!showSolutions) {
    const solutionIdx = html.toLowerCase().indexOf('lösung');
    if (solutionIdx !== -1) {
      // Hide solutions if user selected pupil view
      html = html.slice(0, solutionIdx) + 
        '<div class="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-500 italic mt-6 print:hidden">Lösungsteil für Lehrkräfte ausgeblendet. Klicke oben auf "Lösungen einblenden", um die Musterlösung anzuzeigen.</div>';
    }
  }

  return `<p class="mb-2">${html}</p>`;
}
