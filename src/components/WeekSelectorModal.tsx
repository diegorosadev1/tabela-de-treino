import React from 'react';
import { WEEK_GUIDELINES } from '../data/workoutData';
import { X, Check, Info } from 'lucide-react';

interface WeekSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
  onSelectWeek: (week: number) => void;
}

export const WeekSelectorModal: React.FC<WeekSelectorModalProps> = ({
  isOpen,
  onClose,
  currentWeek,
  onSelectWeek,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[88vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
              📅
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Selecionar Semana
              </h3>
              <p className="text-xs text-stone-500">
                Plano de 6 semanas de consistência e força
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl transition-colors active:scale-95"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-3">
          {WEEK_GUIDELINES.map((item) => {
            const isSelected = item.week === currentWeek;
            return (
              <div
                key={item.week}
                onClick={() => {
                  onSelectWeek(item.week);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {item.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      RIR: {item.rir}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Atual</span>
                    </span>
                  )}
                </div>

                <ul className="space-y-1 text-xs text-stone-600 list-disc list-inside">
                  {item.guidelines.map((g, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <p>
              O RIR (Repetições em Reserva) indica quantas repetições você ainda conseguiria fazer antes de falhar. 
              Nas semanas iniciais, mantenha 2–3 repetições de sobra para aprender o padrão motor com segurança.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-stone-900 text-white font-semibold text-xs transition-colors hover:bg-stone-800 active:scale-95"
          >
            Confirmar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
