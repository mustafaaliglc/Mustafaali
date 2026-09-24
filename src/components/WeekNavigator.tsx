import React, { useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  FolderCheck,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { WeekPlan } from '../types/schedule';
import { LaserBorderCard } from './LaserBorderCard';

interface WeekNavigatorProps {
  weeks: WeekPlan[];
  activeWeekNum: number;
  onSelectWeek: (weekNum: number) => void;
  neonColorMode?: 'blue' | 'green' | 'off';
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  weeks,
  activeWeekNum,
  onSelectWeek,
  neonColorMode = 'blue',
}) => {
  const currentWeek = weeks.find((w) => w.weekNumber === activeWeekNum) || weeks[0];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll active week button into view
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeWeekNum]);

  const handlePrev = () => {
    if (activeWeekNum > 1) onSelectWeek(activeWeekNum - 1);
  };

  const handleNext = () => {
    if (activeWeekNum < 30) onSelectWeek(activeWeekNum + 1);
  };

  const scrollLeftStrip = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRightStrip = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const scrollToFirstWeek = () => {
    onSelectWeek(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10">
      <LaserBorderCard
        neonColorMode={neonColorMode}
        speed="normal"
        active={true}
        innerClassName="p-3 sm:p-4 backdrop-blur-xl border border-sky-900/40"
      >
        {/* Top navigation controls */}
      <div className="flex items-center justify-between gap-3">
        
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={activeWeekNum <= 1}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            activeWeekNum <= 1
              ? 'text-sky-900/40 cursor-not-allowed bg-sky-950/20'
              : 'text-sky-200 hover:text-white bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/50 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:-translate-y-0.5 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Önceki Hafta</span>
        </button>

        {/* Center: Current Week Badge & Quick Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-sky-400 uppercase tracking-wider hidden md:inline">
              Hafta:
            </span>
            <select
              value={activeWeekNum}
              onChange={(e) => onSelectWeek(Number(e.target.value))}
              className="text-xs font-bold text-white bg-[#0f172a] border border-sky-700/60 hover:border-cyan-400 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer shadow-md transition-all hover:shadow-[0_0_15px_rgba(0,210,255,0.25)]"
            >
              {weeks.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber} className="bg-[#0b1329] text-white">
                  {w.weekNumber}. Hafta {w.topic ? `· ${w.topic}` : ''}
                </option>
              ))}
            </select>
          </div>

          {currentWeek.driveFolderUrl && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-lg shadow-sm">
              <FolderCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drive Bağlı</span>
            </span>
          )}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={activeWeekNum >= 30}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            activeWeekNum >= 30
              ? 'text-sky-900/40 cursor-not-allowed bg-sky-950/20'
              : 'text-sky-200 hover:text-white bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/50 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:-translate-y-0.5 active:scale-95'
          }`}
        >
          <span className="hidden sm:inline">Sonraki Hafta</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 30 Week Quick Scroll Strip with Left & Right Arrow controls to ensure 1 & 2 are NEVER hidden */}
      <div className="mt-3 pt-3 border-t border-sky-950/70 flex items-center gap-1">
        
        {/* Quick Scroll to 1. Week & Left nudge */}
        <button
          onClick={scrollToFirstWeek}
          className="p-1.5 rounded-lg text-sky-400/80 hover:text-cyan-300 hover:bg-sky-900/40 border border-transparent hover:border-sky-700/50 transition-all shrink-0 hover:scale-110"
          title="1. Haftaya Git"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={scrollLeftStrip}
          className="p-1.5 rounded-lg text-sky-400/80 hover:text-cyan-300 hover:bg-sky-900/40 border border-transparent hover:border-sky-700/50 transition-all shrink-0 hover:scale-110"
          title="Sola Kaydır"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* The 30 Week Buttons Strip - Fixed left alignment (NO justify-center!) so weeks 1 and 2 are always reachable! */}
        <div
          ref={scrollContainerRef}
          className="flex items-center justify-start gap-1.5 overflow-x-auto py-2 px-2 scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-[#090d1a] scroll-smooth flex-1"
        >
          {weeks.map((week) => {
            const isActive = week.weekNumber === activeWeekNum;
            const hasItems = (week.items || []).some((i) => i.text && i.text.trim() !== '');
            const isAllDone = (week.items || []).length > 0 && (week.items || []).every((i) => i.isCompleted);

            return (
              <button
                key={week.weekNumber}
                ref={isActive ? activeBtnRef : null}
                onClick={() => onSelectWeek(week.weekNumber)}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-400 text-white shadow-[0_0_20px_rgba(0,210,255,0.6)] ring-2 ring-cyan-300 scale-110 z-10 font-black'
                    : 'bg-[#0f172a]/70 hover:bg-sky-950/80 text-sky-200 border border-sky-900/40 hover:text-cyan-300 hover:border-sky-400/70 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 active:scale-95'
                }`}
                title={`${week.weekNumber}. Hafta: ${week.title} ${week.topic ? '- ' + week.topic : ''}`}
              >
                <span>{week.weekNumber}</span>

                {/* Status indicator dot */}
                {isAllDone ? (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#090d1a]" />
                ) : week.driveFolderUrl ? (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-1 ring-[#090d1a] animate-pulse" title="Drive bağlantısı var" />
                ) : hasItems ? (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-sky-400 ring-1 ring-[#090d1a]" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Right nudge */}
        <button
          onClick={scrollRightStrip}
          className="p-1.5 rounded-lg text-sky-400/80 hover:text-cyan-300 hover:bg-sky-900/40 border border-transparent hover:border-sky-700/50 transition-all shrink-0 hover:scale-110"
          title="Sağa Kaydır"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      </LaserBorderCard>
    </div>
  );
};
