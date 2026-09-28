import React from 'react';
import { Copy, Terminal, ExternalLink, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { copyToClipboard } from '../../services/exportService';

interface TabPromptHubProps {
  systemPrompt: string;
  userPrompt: string;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const TabPromptHub: React.FC<TabPromptHubProps> = ({
  systemPrompt,
  userPrompt,
  onShowToast
}) => {
  const handleCopyCombined = async () => {
    const combined = `=== SYSTEM PROMPT ===\n${systemPrompt}\n\n=== USER PROMPT ===\n${userPrompt}`;
    await copyToClipboard(combined);
    onShowToast('Prompt kopiert', 'Der vollständige Prompt liegt in der Zwischenablage.', 'success');
  };

  const handleCopyUserPrompt = async () => {
    await copyToClipboard(userPrompt);
    onShowToast('Benutzer-Prompt kopiert', 'Du kannst ihn direkt in ChatGPT oder Claude einfügen.', 'success');
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-school-primary" />
          <span className="text-xs font-bold text-slate-800">
            Didaktischer Prompt-Hub (Fachdidaktiker-Rolle ThILLM)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyUserPrompt}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            Nur User-Prompt kopieren
          </button>

          <button
            onClick={handleCopyCombined}
            className="px-4 py-1.5 bg-school-primary text-white text-xs font-bold rounded-xl hover:bg-school-primaryDark transition flex items-center gap-1.5 shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            1-Klick Gesamt-Prompt kopieren
          </button>
        </div>
      </div>

      {/* QUICK INSTRUCTIONS */}
      <div className="bg-school-surfaceContainer p-4 rounded-xl border border-school-border flex items-start gap-3 text-xs text-school-textMain">
        <Sparkles className="w-4 h-4 text-school-primary shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold mb-0.5">Nutzung in externen KI-Plattformen:</strong>
          Kopiere diesen Prompt mit einem Klick und füge ihn in <strong>ChatGPT (OpenAI)</strong>, <strong>Claude (Anthropic)</strong>, <strong>DeepSeek</strong> oder die <strong>Thüringer Schulcloud</strong> ein, falls du keine API-Keys verwenden möchtest. Er enthält bereits alle Thüringer Operatoren, Niveaustufen und Formatrestriktionen.
        </div>
      </div>

      {/* SYSTEM PROMPT CARD */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-float overflow-hidden">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300">
            Systemrolle: Thüringer Fachdidaktiker
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
            System Instruction
          </span>
        </div>
        <div className="p-4 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
          {systemPrompt}
        </div>
      </div>

      {/* USER PROMPT CARD */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-float overflow-hidden">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300">
            Generierungs-Prompt (Lehrplan, Operatoren, Gewichtung)
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-school-primaryContainer text-white">
            User Task
          </span>
        </div>
        <div className="p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
          {userPrompt}
        </div>
      </div>
    </div>
  );
};
