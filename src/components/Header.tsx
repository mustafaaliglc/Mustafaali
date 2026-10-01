import React, { useRef } from 'react';
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
  Sparkles 
} from 'lucide-react';
import { ProgramStore } from '../types/schedule';

import { NeonColorMode } from './NeonBackgroundCanvas';
import { LaserBorderCard } from './LaserBorderCard';

interface HeaderProps {
  store: ProgramStore;
  currentView: 'week' | 'roadmap' | 'print' | 'admin' | 'poster';
  setCurrentView: (view: 'week' | 'roadmap' | 'print' | 'admin' | 'poster') => void;
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
    <header className="relative z-50">
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

            {/* AFİŞ BUTONU */}
            <button
              onClick={() => setCurrentView('poster')}
              className={`group relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                currentView === 'poster'
                  ? 'btn-electric text-white shadow-[0_0_20px_rgba(0,210,255,0.5)]'
                  : 'text-sky-300 hover:text-white hover:bg-sky-900/50 hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(0,210,255,0.35)] hover:-translate-y-0.5 active:scale-95'
              }`}
              title="Program Afişini Görüntüle & İndir"
            >
              <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125 group-hover:text-cyan-300 group-hover:rotate-12" />
              <span className="transition-colors group-hover:text-cyan-200">Afiş</span>
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

          {/* İmleç Işığı Butonu - Sadece Elektrik Mavisi & Aç/Kapat */}
          <div>
            <button
              onClick={() => {
                const nextMode = neonColorMode === 'blue' ? 'off' : 'blue';
                if (onSelectNeonMode) {
                  onSelectNeonMode(nextMode);
                } else if (onCycleNeonMode) {
                  onCycleNeonMode();
                }
              }}
              title={neonColorMode === 'blue' ? "İmleç Işığı: Mavi (Tıklayarak kapatabilirsiniz)" : "İmleç Işığını Aç (Mavi)"}
              className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                neonColorMode === 'blue'
                  ? 'text-cyan-300 bg-sky-950/80 border border-cyan-400/60 shadow-[0_0_14px_rgba(0,210,255,0.35)]'
                  : 'text-sky-400/60 bg-black/40 border border-sky-900/40 hover:text-sky-200 hover:border-sky-700'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  neonColorMode === 'blue' ? 'text-cyan-400 group-hover:rotate-45 group-hover:scale-110 shadow-[0_0_8px_#00f0ff]' : 'text-sky-500/50'
                }`}
              />
              <span className="text-[11px] font-medium">
                {neonColorMode === 'blue' ? 'Mavi' : 'Kapalı'}
              </span>
            </button>
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
        </div>
      </LaserBorderCard>
    </header>
  );
};
