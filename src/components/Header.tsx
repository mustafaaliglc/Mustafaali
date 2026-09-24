import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Printer, 
  RotateCcw, 
  LayoutGrid,
  CalendarDays,
  FolderCheck,
  CheckCircle2,
  Lock,
  ShieldCheck,
  LogOut,
  Sparkles,
  Check
} from 'lucide-react';
import { ProgramStore } from '../types/schedule';

import { NeonColorMode } from './NeonBackgroundCanvas';
import { LaserBorderCard } from './LaserBorderCard';

interface HeaderProps {
  store: ProgramStore;
  currentView: 'week' | 'roadmap' | 'print' | 'admin';
  setCurrentView: (view: 'week' | 'roadmap' | 'print' | 'admin') => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  activeWeekNum: number;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
  neonColorMode?: NeonColorMode | 'off';
  onCycleNeonMode?: () => void;
  onSelectNeonMode?: (mode: NeonColorMode | 'off') => void;
}

export const Header: React.FC<HeaderProps> = ({
  store,
  currentView,
  setCurrentView,
  onExport,
  onImport,
  onReset,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin,
  neonColorMode = 'blue',
  onCycleNeonMode,
  onSelectNeonMode,
}) => {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close color menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) {
        setShowColorMenu(false);
      }
    };
    if (showColorMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showColorMenu]);

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
    <header className="relative z-40">
      <LaserBorderCard
        neonColorMode={neonColorMode as ('blue' | 'green' | 'off')}
        speed="slow"
        active={true}
        innerClassName="p-4 sm:p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Mustafa Ali Güleç Branding with Electric Glow */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            {/* Pulsing neon electric blue halo */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-400 opacity-70 group-hover:opacity-100 blur-md transition-all duration-300 animate-pulse-neon" />
            <div className="relative w-11 h-11 rounded-xl bg-[#070b16] text-white font-black text-base flex flex-col items-center justify-center shadow-lg shrink-0 tracking-widest border border-cyan-400/40 transition-transform duration-200 group-hover:scale-105">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-cyan-400">
                MAG
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-2">
                <span>{store.ownerName}</span>
              </h1>
              <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                Web Tasarımı (30 Hafta)
              </span>

              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/50 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Yönetici Modu
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-400/80 bg-sky-950/40 px-2 py-0.5 rounded-full border border-sky-900/40">
                  Ziyaretçi Görünümü
                </span>
              )}
            </div>
            
            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-sky-300/80 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-cyan-300">
                <FolderCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{driveCount} Drive Bağlı</span>
              </span>
              <span className="text-sky-800">•</span>
              <span className="flex items-center gap-1.5 font-medium text-sky-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>{filledItems} Program Maddesi</span>
              </span>
              <span className="text-sky-800">•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Otomatik Kayıt</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: View Switcher & Action Buttons with High-Impact Hover Animations */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          
          {/* View Mode Buttons (Haftalık, 30 Hafta, Yazdır, Admin) */}
          <div className="inline-flex rounded-xl bg-[#091124] p-1 border border-sky-900/60 shadow-inner">
            
            {/* Haftalık Butonu */}
            <button
              onClick={() => setCurrentView('week')}
              className={`group relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                currentView === 'week'
                  ? 'btn-electric text-white shadow-[0_0_20px_rgba(0,210,255,0.5)]'
                  : 'text-sky-300 hover:text-white hover:bg-sky-900/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-120 group-hover:text-cyan-300" />
              <span>Haftalık</span>
            </button>

            {/* 30 Hafta Butonu */}
            <button
              onClick={() => setCurrentView('roadmap')}
              className={`group relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                currentView === 'roadmap'
                  ? 'btn-electric text-white shadow-[0_0_20px_rgba(0,210,255,0.5)]'
                  : 'text-sky-300 hover:text-white hover:bg-sky-900/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-120 group-hover:text-cyan-300 group-hover:rotate-12" />
              <span>30 Hafta</span>
            </button>

            {/* YAZDIR BUTONU - Animasyonlu (Hover olunca parlar, hafif kalkar, ikon döner) */}
            <button
              onClick={() => setCurrentView('print')}
              className={`group relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                currentView === 'print'
                  ? 'btn-electric text-white shadow-[0_0_20px_rgba(0,210,255,0.5)]'
                  : 'text-sky-300 hover:text-white hover:bg-sky-900/50 hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(0,210,255,0.35)] hover:-translate-y-0.5 active:scale-95'
              }`}
              title="Yazdırma & PDF Görünümünü Aç"
            >
              <Printer className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125 group-hover:text-cyan-300 group-hover:-rotate-12" />
              <span className="transition-colors group-hover:text-cyan-200">Yazdır</span>
            </button>

            {/* Admin Panel Tab */}
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  currentView === 'admin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'text-emerald-400 hover:text-emerald-200 hover:bg-emerald-950/50 hover:-translate-y-0.5 active:scale-95'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 transition-transform group-hover:scale-115" />
                <span>Admin Paneli</span>
              </button>
            )}
          </div>

          <div className="h-5 w-px bg-sky-900/50 hidden sm:block" />

          {/* Admin Login / Logout Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentView('admin')}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 hover:border-emerald-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:scale-95"
                title="Yönetici Paneline Git"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:scale-115" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={onLogoutAdmin}
                className="group p-1.5 text-xs font-medium text-sky-400 hover:text-red-400 hover:bg-red-950/40 border border-sky-900/50 hover:border-red-500/50 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                title="Yönetici Çıkışı Yap"
              >
                <LogOut className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950/90 border border-sky-700/60 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:-translate-y-0.5 active:scale-95"
              title="Drive linklerini düzenlemek için yönetici girişi yapın"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              <span className="group-hover:text-white">Admin Girişi</span>
            </button>
          )}

          <div className="h-5 w-px bg-sky-900/50 hidden sm:block" />

          {/* Siber Atmosfer & Renk Seçici Butonu */}
          <div className="relative z-50" ref={colorMenuRef}>
            <button
              onClick={() => setShowColorMenu(!showColorMenu)}
              title="Siber atmosfer temasını değiştir veya kapat"
              className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                neonColorMode === 'blue'
                  ? 'text-cyan-300 bg-sky-950/80 border border-cyan-400/60 shadow-[0_0_14px_rgba(0,210,255,0.35)]'
                  : neonColorMode === 'green'
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/60 shadow-[0_0_14px_rgba(0,255,157,0.35)]'
                  : 'text-sky-400/60 bg-black/40 border border-sky-900/40 hover:text-sky-200 hover:border-sky-700'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  neonColorMode !== 'off' ? 'group-hover:rotate-45 group-hover:scale-110' : 'text-sky-500/50'
                }`}
              />
              <span className="hidden sm:inline text-[11px]">
                {neonColorMode === 'blue' && '⚡ Elektrik Mavisi'}
                {neonColorMode === 'green' && '🟢 Matrix Yeşili'}
                {neonColorMode === 'off' && 'Atmosfer Kapalı'}
              </span>
            </button>

            {/* Dropdown Menu (Guaranteed on top of all elements) */}
            {showColorMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#090f20] border-2 border-cyan-400/80 rounded-2xl p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5">
                <div className="px-2.5 py-1 text-[10px] font-bold text-cyan-300 uppercase tracking-wider border-b border-sky-800/60 mb-1 flex items-center justify-between">
                  <span>Siber Atmosfer</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <button
                  onClick={() => {
                    onSelectNeonMode?.('blue');
                    setShowColorMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                    neonColorMode === 'blue'
                      ? 'bg-sky-950 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'text-sky-200 hover:bg-sky-950/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    <span className="font-semibold">Elektrik Mavisi</span>
                  </span>
                  {neonColorMode === 'blue' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                <button
                  onClick={() => {
                    onSelectNeonMode?.('green');
                    setShowColorMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                    neonColorMode === 'green'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                      : 'text-sky-200 hover:bg-sky-950/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff9d]" />
                    <span className="font-semibold">Matrix Yeşili</span>
                  </span>
                  {neonColorMode === 'green' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <div className="border-t border-sky-950/80 pt-1">
                  <button
                    onClick={() => {
                      onSelectNeonMode?.('off');
                      setShowColorMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                      neonColorMode === 'off'
                        ? 'bg-red-950/60 text-red-300 border border-red-500/40'
                        : 'text-sky-400/70 hover:bg-sky-950/40 hover:text-red-300'
                    }`}
                  >
                    <span>Kapat</span>
                    {neonColorMode === 'off' && <Check className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export / Import / Reset with Hover Animations */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onExport}
              title="Programı JSON olarak yedekle"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950/90 border border-sky-800/50 hover:border-sky-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:translate-y-0.5" />
              <span className="hidden sm:inline">Yedekle</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Yedekten geri yükle"
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950/90 border border-sky-800/50 hover:border-sky-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:-translate-y-0.5" />
                  <span className="hidden sm:inline">Yükle</span>
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
                  className="group inline-flex items-center p-2 text-xs font-medium text-sky-400 hover:text-red-400 hover:bg-red-950/40 border border-sky-900/40 hover:border-red-500/50 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-90 duration-300" />
                </button>
              </>
            )}
          </div>
        </div>
      </LaserBorderCard>
    </header>
  );
};
