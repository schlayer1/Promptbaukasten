import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Download, 
  QrCode, 
  Code, 
  Maximize2, 
  ExternalLink, 
  FileCheck, 
  Share2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { downloadFile, generateQrCodeDataUrl, copyToClipboard } from '../../services/exportService';

interface TabInteractiveGameProps {
  gameHtml: string;
  giftExport: string;
  title: string;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const TabInteractiveGame: React.FC<TabInteractiveGameProps> = ({
  gameHtml,
  giftExport,
  title,
  onShowToast
}) => {
  const [activeSubView, setActiveSubView] = useState<'sandbox' | 'qr' | 'code'>('sandbox');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR Code containing either data URI or instruction
    const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(gameHtml)}`;
    // If string is too long for basic QR, generate with direct URL or placeholder
    generateQrCodeDataUrl(window.location.href).then(setQrDataUrl);
  }, [gameHtml]);

  const handleDownloadHtml = () => {
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'lernspiel';
    downloadFile(gameHtml, `${safeTitle}_regelschule.html`, 'text/html;charset=utf-8');
    onShowToast('Heruntergeladen', 'Single-File HTML-Lernspiel wurde gespeichert.', 'success');
  };

  const handleDownloadGift = () => {
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'lernspiel';
    downloadFile(giftExport, `${safeTitle}_moodle_tsc.gift`, 'text/plain;charset=utf-8');
    onShowToast('Exportiert', 'GIFT-Datei für Moodle / Thüringer Schulcloud gespeichert.', 'success');
  };

  const handleCopyIframe = async () => {
    const iframeCode = `<iframe src="${title}_regelschule.html" width="100%" height="700" frameborder="0" allow="autoplay; microphone"></iframe>`;
    await copyToClipboard(iframeCode);
    onShowToast('Kopiert', 'iFrame-Embed-Code liegt in der Zwischenablage.', 'success');
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([gameHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubView('sandbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubView === 'sandbox'
                ? 'bg-white text-school-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Live-Sandbox
          </button>

          <button
            onClick={() => setActiveSubView('qr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubView === 'qr'
                ? 'bg-white text-school-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Tablet-QR-Code
          </button>

          <button
            onClick={() => setActiveSubView('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubView === 'code'
                ? 'bg-white text-school-primary shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            HTML-Quellcode
          </button>
        </div>

        {/* EXPORT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-1.5 bg-school-primary text-white text-xs font-bold rounded-xl hover:bg-school-primaryDark transition flex items-center gap-1.5 shadow-sm"
            title="Vollständig autarkes HTML-Lernspiel für Schüler-Tablets herunterladen"
          >
            <Download className="w-3.5 h-3.5" />
            Lernspiel (.html)
          </button>

          <button
            onClick={handleDownloadGift}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            title="Moodle GIFT Format für die Thüringer Schulcloud (TSC)"
          >
            <FileCheck className="w-3.5 h-3.5 text-school-secondary" />
            TSC-GIFT
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="In neuem Browser-Tab im Vollbild öffnen"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW: SANDBOX */}
      {activeSubView === 'sandbox' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-float overflow-hidden flex flex-col">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Interaktive Vorschau (Single-File Offline HTML mit Audio-Synthesizer & Web Speech)
            </span>
            <button
              onClick={handleOpenNewTab}
              className="hover:text-school-primary flex items-center gap-1 font-bold"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Vollbild
            </button>
          </div>
          <div className="w-full h-[620px] bg-slate-50 relative">
            <iframe
              srcDoc={gameHtml}
              title="Interaktives Lernspiel"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-modals allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* VIEW: QR CODE */}
      {activeSubView === 'qr' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-school-primaryLight text-school-primary flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base mb-1">Klassenraum-Modus (Tablet-Verteilung)</h3>
          <p className="text-xs text-slate-500 mb-6">
            Schülerinnen und Schüler können den QR-Code mit der Tablet-Kamera scannen, um das Lernspiel direkt auf ihrem Gerät aufzurufen.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-school-primary/30 inline-block mb-4 shadow-sm">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Tablet QR-Code" className="w-56 h-56 mx-auto rounded-lg" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">QR-Code wird generiert...</div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownloadHtml}
              className="w-full py-2.5 bg-school-primary text-white font-bold text-xs rounded-xl hover:bg-school-primaryDark transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Lernspiel herunterladen & auf Schulserver ablegen
            </button>

            <button
              onClick={handleCopyIframe}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              iFrame-Einbettungscode für Schul-Homepage kopieren
            </button>
          </div>
        </div>
      )}

      {/* VIEW: RAW HTML CODE */}
      {activeSubView === 'code' && (
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto max-h-[620px] shadow-float border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-slate-400">Autarkes Single-File HTML</span>
            <button
              onClick={() => {
                copyToClipboard(gameHtml);
                onShowToast('Kopiert', 'HTML-Code in die Zwischenablage kopiert.', 'success');
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-bold"
            >
              Code kopieren
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{gameHtml}</pre>
        </div>
      )}
    </div>
  );
};
