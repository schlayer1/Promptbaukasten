import React from 'react';
import { FileText, Gamepad2, CheckSquare, Sparkles, Globe } from 'lucide-react';
import { TaskFormatId } from '../../types/generator';
import { TASK_FORMATS } from '../../data/defaultPresets';

interface StepFormatSelectProps {
  selectedFormat: TaskFormatId;
  onSelectFormat: (format: TaskFormatId) => void;
}

export const StepFormatSelect: React.FC<StepFormatSelectProps> = ({
  selectedFormat,
  onSelectFormat
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-school-primary text-white text-[11px] font-bold flex items-center justify-center">1</span>
          Aufgabenformat wählen
        </label>
        <span className="text-[11px] text-slate-400">Didaktischer Schwerpunkt</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TASK_FORMATS.map(f => {
          const isSelected = selectedFormat === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFormat(f.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-school-primary bg-school-primaryLight/40 ring-2 ring-school-primary/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {getIcon(f.icon)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-school-primary text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{f.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{f.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
