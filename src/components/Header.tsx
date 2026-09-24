import React, { useRef } from 'react';
import { 
  Download, 
  Upload, 
  Printer, 
  RotateCcw, 
  LayoutGrid,
  CalendarDays,
  FolderCheck,
  CheckCircle2
} from 'lucide-react';
import { ProgramStore } from '../types/schedule';

interface HeaderProps {
  store: ProgramStore;
  currentView: 'week' | 'roadmap' | 'print';
  setCurrentView: (view: 'week' | 'roadmap' | 'print') => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  activeWeekNum: number;
}

export const Header: React.FC<HeaderProps> = ({
  store,
  currentView,
  setCurrentView,
  onExport,
  onImport,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute stats
  let totalItems = 0;
  let filledItems = 0;
  let completedItems = 0;
  let driveCount = 0;

  store.weeks.forEach((week) => {
    if (week.driveFolderUrl) driveCount++;
    (week.items || []).forEach((item) => {
      totalItems++;
      if (item.text && item.text.trim() !== '') filledItems++;
      if (item.isCompleted) completedItems++;
    });
  });

  return (
    <header className="border-b border-purple-900/40 bg-[#0c081e]/85 backdrop-blur-md sticky top-0 z-30 shadow-lg shadow-purple-950/20">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Mustafa Ali Güleç Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-600/30 shrink-0 tracking-wider border border-purple-400/30">
            MAG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                {store.ownerName}
              </h1>
              <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/50 shadow-xs">
                Web Tasarımı (30 Hafta)
              </span>
            </div>
            <p className="text-xs text-purple-300/70 font-medium">
              30 Haftalık Web Tasarımı Müfredatı & Google Drive Ders Materyalleri
            </p>
          </div>
        </div>

        {/* Center/Right: View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Mode Buttons */}
          <div className="inline-flex rounded-xl bg-purple-950/50 p-1 border border-purple-800/40 backdrop-blur-xs">
            <button
              onClick={() => setCurrentView('week')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'week'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Haftalık Program</span>
            </button>
            <button
              onClick={() => setCurrentView('roadmap')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'roadmap'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>30 Hafta Listesi</span>
            </button>
            <button
              onClick={() => setCurrentView('print')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'print'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>
          </div>

          <div className="h-5 w-px bg-purple-900/40 hidden sm:block" />

          {/* Export / Import / Reset */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onExport}
              title="Programı JSON olarak yedekle"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Yedekle</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Yedekten geri yükle"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">İçe Aktar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />

            <button
              onClick={onReset}
              title="Tüm programı sıfırla"
              className="inline-flex items-center p-1.5 text-xs font-medium text-purple-400 hover:text-red-400 hover:bg-red-950/40 border border-purple-800/30 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar: Status line without any hours or sessions */}
      <div className="bg-[#090517]/90 border-t border-purple-900/30 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-purple-300/80 gap-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">30 Hafta</span>
              <span className="text-purple-400/80">Web Tasarımı</span>
            </div>
            <span className="text-purple-800">|</span>
            <div className="flex items-center gap-1.5">
              <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{driveCount}</span>
              <span className="text-purple-400/80">Drive Klasörü Bağlı</span>
            </div>
            <span className="text-purple-800">|</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold text-white">{filledItems}</span>
              <span className="text-purple-400/80">Doldurulan Program Maddesi</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-purple-400/70 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Otomatik Kaydedilir</span>
          </div>
        </div>
      </div>
    </header>
  );
};
