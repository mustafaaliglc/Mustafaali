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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#120a26] rounded-2xl shadow-2xl w-full max-w-lg border border-purple-800/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-purple-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {sourceWeek.weekNumber}. Haftanın Programını Kopyala
              </h3>
              <p className="text-xs text-purple-300/70">
                Bu haftanın program yapısını seçtiğiniz diğer haftalara uygular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white p-1.5 rounded-lg hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-200">
              Hedef Haftaları Seçin ({selectedWeeks.length} seçildi):
            </span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Tümünü Seç
              </button>
              <span className="text-purple-800">|</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-purple-400/70 hover:text-purple-300 font-semibold"
              >
                Temizle
              </button>
            </div>
          </div>

          {/* 30 Weeks Grid Picker */}
          <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-purple-800">
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
                      ? 'bg-purple-950/20 text-purple-700/50 border-purple-900/30 cursor-not-allowed'
                      : isSelected
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                      : 'bg-black/30 hover:bg-purple-950/60 text-purple-200 border-purple-900/40'
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
        <div className="px-6 py-4 bg-purple-950/40 border-t border-purple-900/40 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-purple-300 hover:text-white bg-black/30 hover:bg-purple-950/50 border border-purple-900/40 rounded-xl transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            disabled={selectedWeeks.length === 0}
            onClick={handleApply}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all ${
              selectedWeeks.length === 0
                ? 'bg-purple-800/40 text-purple-500/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30'
            }`}
          >
            Seçilen Haftalara Kopyala ({selectedWeeks.length})
          </button>
        </div>

      </div>
    </div>
  );
};
