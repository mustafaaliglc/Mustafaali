import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { WeekPlan } from '../types/schedule';

interface CopyWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceWeek: WeekPlan;
  totalWeeks: number;
  onConfirmCopy: (sourceWeekNum: number, targetWeekNums: number[]) => void;
}

export const CopyWeekModal: React.FC<CopyWeekModalProps> = ({
  isOpen,
  onClose,
  sourceWeek,
  totalWeeks,
  onConfirmCopy,
}) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleWeek = (num: number) => {
    if (num === sourceWeek.weekNumber) return;
    setSelectedWeeks((prev) =>
      prev.includes(num) ? prev.filter((w) => w !== num) : [...prev, num]
    );
  };

  const handleSelectAll = () => {
    const all = Array.from({ length: totalWeeks }, (_, i) => i + 1).filter(
      (w) => w !== sourceWeek.weekNumber
    );
    setSelectedWeeks(all);
  };

  const handleDeselectAll = () => {
    setSelectedWeeks([]);
  };

  const handleApply = () => {
    if (selectedWeeks.length === 0) return;
    onConfirmCopy(sourceWeek.weekNumber, selectedWeeks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#080d1a] rounded-2xl shadow-2xl shadow-black w-full max-w-lg border border-sky-600/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-900/50 flex items-center justify-between bg-sky-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg btn-electric text-white flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {sourceWeek.weekNumber}. Haftanın Programını Kopyala
              </h3>
              <p className="text-xs text-sky-300/80">
                Bu haftanın program yapısını seçtiğiniz diğer haftalara uygular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-400 hover:text-white p-1.5 rounded-lg hover:bg-sky-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-sky-200">
              Hedef Haftaları Seçin ({selectedWeeks.length} seçildi):
            </span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Tümünü Seç
              </button>
              <span className="text-sky-800">|</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-sky-400/70 hover:text-sky-300 font-semibold"
              >
                Temizle
              </button>
            </div>
          </div>

          {/* 30 Weeks Grid Picker */}
          <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-sky-800">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
              const isSource = weekNum === sourceWeek.weekNumber;
              const isSelected = selectedWeeks.includes(weekNum);

              return (
                <button
                  key={weekNum}
                  disabled={isSource}
                  onClick={() => toggleWeek(weekNum)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                    isSource
                      ? 'bg-sky-950/20 text-sky-700/50 border-sky-900/30 cursor-not-allowed'
                      : isSelected
                      ? 'btn-electric text-white border-cyan-400 shadow-md'
                      : 'bg-black/40 hover:bg-sky-950/60 text-sky-200 border-sky-900/50'
                  }`}
                >
                  {isSource ? (
                    <span>H.{weekNum} (Kaynak)</span>
                  ) : (
                    <>
                      <span>H.{weekNum}</span>
                      {isSelected && <Check className="w-3 h-3" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#060a14] border-t border-sky-950/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-sky-300 hover:text-white bg-black/40 hover:bg-sky-950/50 border border-sky-900/40 rounded-xl transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            disabled={selectedWeeks.length === 0}
            onClick={handleApply}
            className={`btn-electric px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all ${
              selectedWeeks.length === 0
                ? 'opacity-40 cursor-not-allowed'
                : 'shadow-md shadow-sky-900/40'
            }`}
          >
            Seçilen Haftalara Kopyala ({selectedWeeks.length})
          </button>
        </div>

      </div>
    </div>
  );
};
