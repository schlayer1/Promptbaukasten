import React from 'react';
import { Target, Sliders, Info, Check } from 'lucide-react';
import { AfbDistribution } from '../../types/curriculum';
import { THUERINGEN_OPERATORS, OPERATOR_PRESETS } from '../../data/thueringenOperators';

interface StepOperatorAfbProps {
  distribution: AfbDistribution;
  selectedOperators: string[];
  onDistributionChange: (dist: AfbDistribution) => void;
  onOperatorToggle: (operatorId: string) => void;
}

export const StepOperatorAfb: React.FC<StepOperatorAfbProps> = ({
  distribution,
  selectedOperators,
  onDistributionChange,
  onOperatorToggle
}) => {
  const applyPreset = (key: keyof typeof OPERATOR_PRESETS) => {
    onDistributionChange(OPERATOR_PRESETS[key]);
  };

  const afb1Ops = THUERINGEN_OPERATORS.filter(o => o.afb === 'I');
  const afb2Ops = THUERINGEN_OPERATORS.filter(o => o.afb === 'II');
  const afb3Ops = THUERINGEN_OPERATORS.filter(o => o.afb === 'III');

  return (
    <div className="space-y-4 pt-2 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-school-primary text-white text-[11px] font-bold flex items-center justify-center">3</span>
          Thüringer Operatoren-Wächter & AFB-Tuning
        </label>
        <span className="text-[11px] font-semibold text-slate-500">KMK Anforderungsbereiche</span>
      </div>

      {/* AFB DISTRIBUTION BAR */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-school-primary" />
            Punktegewichtung nach AFB:
          </span>
          
          <div className="flex gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => applyPreset('standard')}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-school-primary font-semibold text-slate-700"
            >
              Standard 40/40/20
            </button>
            <button
              type="button"
              onClick={() => applyPreset('basicPractice')}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-school-primary font-semibold text-slate-700"
            >
              Üben 60/30/10
            </button>
            <button
              type="button"
              onClick={() => applyPreset('advancedExam')}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-school-primary font-semibold text-slate-700"
            >
              Prüfung 25/45/30
            </button>
          </div>
        </div>

        {/* VISUAL BAR */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${distribution.afb1}%` }} 
            className="bg-emerald-500 transition-all duration-300" 
            title={`AFB I: ${distribution.afb1}%`} 
          />
          <div 
            style={{ width: `${distribution.afb2}%` }} 
            className="bg-amber-500 transition-all duration-300" 
            title={`AFB II: ${distribution.afb2}%`} 
          />
          <div 
            style={{ width: `${distribution.afb3}%` }} 
            className="bg-rose-500 transition-all duration-300" 
            title={`AFB III: ${distribution.afb3}%`} 
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2.5 text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg py-1.5 px-2">
            <div className="text-[10px] font-bold text-emerald-800">AFB I (Reproduktion)</div>
            <div className="text-xs font-black text-emerald-900">{distribution.afb1}%</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg py-1.5 px-2">
            <div className="text-[10px] font-bold text-amber-800">AFB II (Transfer)</div>
            <div className="text-xs font-black text-amber-900">{distribution.afb2}%</div>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg py-1.5 px-2">
            <div className="text-[10px] font-bold text-rose-800">AFB III (Reflexion)</div>
            <div className="text-xs font-black text-rose-900">{distribution.afb3}%</div>
          </div>
        </div>
      </div>

      {/* OPERATOR CHIPS LIST */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          Verbindliche Thüringer Operatoren aktivieren:
        </label>

        <div className="space-y-2">
          {/* AFB I */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              AFB I: Wissen & Wiedergeben
            </div>
            <div className="flex flex-wrap gap-1.5">
              {afb1Ops.map(op => {
                const isSelected = selectedOperators.includes(op.id);
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => onOperatorToggle(op.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                    }`}
                    title={`${op.description} (z.B. "${op.example}")`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {op.name.split('/')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AFB II */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              AFB II: Verstehen, Anwenden & Erläutern
            </div>
            <div className="flex flex-wrap gap-1.5">
              {afb2Ops.map(op => {
                const isSelected = selectedOperators.includes(op.id);
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => onOperatorToggle(op.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-amber-600 border-amber-700 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                    }`}
                    title={`${op.description} (z.B. "${op.example}")`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {op.name.split('/')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AFB III */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              AFB III: Beurteilen, Bewerten & Gestalten
            </div>
            <div className="flex flex-wrap gap-1.5">
              {afb3Ops.map(op => {
                const isSelected = selectedOperators.includes(op.id);
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => onOperatorToggle(op.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-rose-600 border-rose-700 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300'
                    }`}
                    title={`${op.description} (z.B. "${op.example}")`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {op.name.split('/')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
