import React, { useState, useEffect } from 'react';
import { 
  ProgramStore, 
  WeekPlan 
} from './types/schedule';
import { 
  loadProgramFromStorage, 
  saveProgramToStorage, 
  createInitialProgramStore 
} from './data/initialData';
import { Header } from './components/Header';
import { WeekNavigator } from './components/WeekNavigator';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { MasterRoadmapView } from './components/MasterRoadmapView';
import { PrintView } from './components/PrintView';
import { CopyWeekModal } from './components/CopyWeekModal';
import { ChatBot } from './components/ChatBot';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OpeningAnimation } from './components/OpeningAnimation';
import { NeonBackgroundCanvas, NeonColorMode } from './components/NeonBackgroundCanvas';

export default function App() {
  const [store, setStore] = useState<ProgramStore>(() => loadProgramFromStorage());
  const [activeWeekNum, setActiveWeekNum] = useState<number>(1);
  const [currentView, setCurrentView] = useState<'week' | 'roadmap' | 'print' | 'admin'>('week');
  const [neonColorMode, setNeonColorMode] = useState<NeonColorMode | 'off'>(() => {
    try {
      const saved = localStorage.getItem('mag_neon_color_mode');
      if (saved === 'blue' || saved === 'green' || saved === 'off') {
        return saved;
      }
      return 'blue';
    } catch {
      return 'blue';
    }
  });

  const handleCycleNeonMode = () => {
    const sequence: (NeonColorMode | 'off')[] = ['blue', 'green', 'off'];
    const currentIndex = sequence.indexOf(neonColorMode);
    const nextIndex = (currentIndex + 1) % sequence.length;
    const nextMode = sequence[nextIndex];
    setNeonColorMode(nextMode);
    try {
      localStorage.setItem('mag_neon_color_mode', nextMode);
    } catch {}
  };

  const handleSelectNeonMode = (mode: NeonColorMode | 'off') => {
    setNeonColorMode(mode);
    try {
      localStorage.setItem('mag_neon_color_mode', mode);
    } catch {}
  };

  // Modern Opening Splash Animation (runs on initial visit, auto-completes in 1.4s)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mag_intro_shown') !== 'true';
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('mag_intro_shown', 'true');
    } catch {}
  };

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mag_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem('mag_admin_pin') || '1234';
    } catch {
      return '1234';
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Copy modal state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Save to localStorage whenever store changes
  useEffect(() => {
    saveProgramToStorage(store);
  }, [store]);

  // Persist admin state
  useEffect(() => {
    try {
      localStorage.setItem('mag_is_admin', isAdmin ? 'true' : 'false');
    } catch {}
  }, [isAdmin]);

  const handleChangePin = (newPin: string) => {
    setAdminPin(newPin);
    try {
      localStorage.setItem('mag_admin_pin', newPin);
    } catch {}
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    if (currentView === 'admin') {
      setCurrentView('week');
    }
  };

  const activeWeek = store.weeks.find((w) => w.weekNumber === activeWeekNum) || store.weeks[0];

  // Update current active week
  const handleUpdateWeek = (updatedWeek: WeekPlan) => {
    setStore((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => (w.weekNumber === updatedWeek.weekNumber ? updatedWeek : w)),
    }));
  };

  // Confirm copy week structure to target weeks
  const handleConfirmCopy = (sourceWeekNum: number, targetWeekNums: number[]) => {
    const sourceWeek = store.weeks.find((w) => w.weekNumber === sourceWeekNum);
    if (!sourceWeek) return;

    setStore((prev) => {
      const updatedWeeks = prev.weeks.map((week) => {
        if (!targetWeekNums.includes(week.weekNumber)) return week;

        // Clone items with fresh IDs
        const clonedItems = (sourceWeek.items || []).map((item, idx) => ({
          ...item,
          id: `w${week.weekNumber}-item-${idx + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          isCompleted: false,
        }));

        return {
          ...week,
          topic: sourceWeek.topic || week.topic,
          content: sourceWeek.content || week.content,
          items: clonedItems,
        };
      });

      return {
        ...prev,
        weeks: updatedWeeks,
      };
    });
  };

  // Export JSON file
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Mustafa_Ali_Gulec_30_Haftalik_Web_Tasarimi_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.weeks) && parsed.weeks.length === 30) {
            setStore(parsed);
            alert('30 haftalık web tasarımı programı başarıyla yüklendi!');
          } else {
            alert('Hatalı dosya formatı: 30 haftalık program verisi bulunamadı.');
          }
        } catch (err) {
          alert('JSON dosyası okunurken hata oluştu.');
        }
      };
    }
  };

  // Reset to default blank state
  const handleReset = () => {
    if (
      confirm(
        'Tüm 30 haftalık programı sıfırlamak istediğinize emin misiniz? (Dilerseniz önce Yedekle butonunu kullanabilirsiniz).'
      )
    ) {
      const fresh = createInitialProgramStore();
      setStore(fresh);
      setActiveWeekNum(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060c] text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      
      {/* Deep Obsidian Background with Electric Blue Radial Glow (Never flashes white) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b1a30] via-[#050b17] to-[#04060c] -z-20 pointer-events-none" />

      {/* Interactive Neon Particle & Background Wave Effect */}
      {neonColorMode !== 'off' && <NeonBackgroundCanvas colorMode={neonColorMode} />}

      {/* Floating Ambient Glowing Electric Blue & Cyan Orbs */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed bottom-[-5%] right-[10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none -z-10 animate-float-reverse" />

      {/* Opening Intro Animation */}
      {showIntro && (
        <OpeningAnimation
          ownerName={store.ownerName}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Centered Main Application Shell with Staggered Entrance Animation */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Top Header Card */}
        <Header
          store={store}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
          activeWeekNum={activeWeekNum}
          isAdmin={isAdmin}
          onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          onLogoutAdmin={handleAdminLogout}
          neonColorMode={neonColorMode}
          onCycleNeonMode={handleCycleNeonMode}
          onSelectNeonMode={handleSelectNeonMode}
        />

        {/* Week Navigator (shown in 'week' view) - Now with fixed weeks 1 & 2 scroll bug */}
        {currentView === 'week' && (
          <div className="relative z-20">
            <WeekNavigator
              weeks={store.weeks}
              activeWeekNum={activeWeekNum}
              onSelectWeek={(num) => setActiveWeekNum(num)}
              neonColorMode={neonColorMode}
            />
          </div>
        )}

        {/* Views */}
        <main className="relative z-10 pt-1">
          {currentView === 'week' && (
            <WeeklyScheduleView
              week={activeWeek}
              onUpdateWeek={handleUpdateWeek}
              onOpenCopyModal={() => setIsCopyModalOpen(true)}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => setIsLoginModalOpen(true)}
              neonColorMode={neonColorMode}
            />
          )}

          {currentView === 'roadmap' && (
            <MasterRoadmapView
              weeks={store.weeks}
              neonColorMode={neonColorMode}
              onSelectWeek={(num) => {
                setActiveWeekNum(num);
                setCurrentView('week');
              }}
            />
          )}

          {currentView === 'print' && (
            <PrintView
              store={store}
              activeWeekNum={activeWeekNum}
              onBack={() => setCurrentView('week')}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboard
              store={store}
              onUpdateWeek={handleUpdateWeek}
              adminPin={adminPin}
              onChangePin={handleChangePin}
              onLogout={handleAdminLogout}
              onSelectWeek={(num) => {
                setActiveWeekNum(num);
                setCurrentView('week');
              }}
            />
          )}
        </main>

      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        currentPin={adminPin}
      />

      {/* Copy Modal */}
      <CopyWeekModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        sourceWeek={activeWeek}
        totalWeeks={store.totalWeeks}
        onConfirmCopy={handleConfirmCopy}
      />

      {/* Modern Floating AI Chatbot */}
      <ChatBot
        weeks={store.weeks}
        activeWeekNum={activeWeekNum}
        onSelectWeek={(num) => {
          setActiveWeekNum(num);
          setCurrentView('week');
        }}
      />

    </div>
  );
}
