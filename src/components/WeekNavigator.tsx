import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles
} from 'lucide-react';
import { WeekPlan } from '../types/schedule';

interface WeekNavigatorProps {
  weeks: WeekPlan[];
  activeWeekNum: number;
  onSelectWeek: (weekNum: number) => void;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  weeks,
  activeWeekNum,
  onSelectWeek,
}) => {
  const currentWeek = weeks.find((w) => w.weekNumber === activeWeekNum) || weeks[0];

  const handlePrev = () => {
    if (activeWeekNum > 1) onSelectWeek(activeWeekNum - 1);
  };

  const handleNext = () => {
    if (activeWeekNum < 30) onSelectWeek(activeWeekNum + 1);
  };

  return (
    <div className="bg-[#0e0a22]/80 backdrop-blur-md border-b border-purple-900/40 sticky top-[95px] z-20 shadow-md shadow-purple-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        
        {/* Navigation bar with week picker */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Prev button */}
          <button
            onClick={handlePrev}
            disabled={activeWeekNum <= 1}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeWeekNum <= 1
                ? 'text-purple-700/40 cursor-not-allowed'
                : 'text-purple-200 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 shadow-xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Önceki Hafta</span>
          </button>

          {/* Center Selector Dropdown on Mobile / Quick Jump */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300 hidden md:inline">
              Hafta Seçimi:
            </span>
            <select
              value={activeWeekNum}
              onChange={(e) => onSelectWeek(Number(e.target.value))}
              className="text-xs font-bold text-white bg-purple-950/80 border border-purple-700/60 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-xs"
            >
              {weeks.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber} className="bg-[#100b26] text-white">
                  {w.weekNumber}. Hafta {w.topic ? `(${w.topic})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 30 Week Pills - Compact horizontal scroll bar */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 px-1 scrollbar-thin scrollbar-thumb-purple-800">
            {weeks.map((week) => {
              const isActive = week.weekNumber === activeWeekNum;
              const hasItems = (week.items || []).some((i) => i.text && i.text.trim() !== '');
              const isAllDone = (week.items || []).length > 0 && (week.items || []).every((i) => i.isCompleted);

              return (
                <button
                  key={week.weekNumber}
                  onClick={() => onSelectWeek(week.weekNumber)}
                  className={`relative flex items-center justify-center min-w-[34px] h-[30px] rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-400'
                      : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-900/40'
                  }`}
                  title={`${week.weekNumber}. Hafta: ${week.title} ${week.topic ? '- ' + week.topic : ''}`}
                >
                  <span>{week.weekNumber}</span>

                  {/* Little status indicator */}
                  {isAllDone ? (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#0e0a22]" />
                  ) : week.driveFolderUrl ? (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400 ring-1 ring-[#0e0a22]" title="Drive bağlantısı var" />
                  ) : hasItems ? (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-purple-400 ring-1 ring-[#0e0a22]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={activeWeekNum >= 30}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeWeekNum >= 30
                ? 'text-purple-700/40 cursor-not-allowed'
                : 'text-purple-200 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 shadow-xs'
            }`}
          >
            <span className="hidden sm:inline">Sonraki Hafta</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
