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

export default function App() {
  const [store, setStore] = useState<ProgramStore>(() => loadProgramFromStorage());
  const [activeWeekNum, setActiveWeekNum] = useState<number>(1);
  const [currentView, setCurrentView] = useState<'week' | 'roadmap' | 'print'>('week');

  // Copy modal state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Save to localStorage whenever store changes
  useEffect(() => {
    saveProgramToStorage(store);
  }, [store]);

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
          isCompleted: false, // Reset completed status in destination
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
    <div className="min-h-screen bg-[#070312] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d0b38] via-[#0b051c] to-[#04010a] text-slate-100 font-sans flex flex-col antialiased selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      
      {/* Ambient background glowing orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Application Header */}
      <Header
        store={store}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        activeWeekNum={activeWeekNum}
      />

      {/* Week Navigator (shown in 'week' view) */}
      {currentView === 'week' && (
        <WeekNavigator
          weeks={store.weeks}
          activeWeekNum={activeWeekNum}
          onSelectWeek={(num) => setActiveWeekNum(num)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'week' && (
          <WeeklyScheduleView
            week={activeWeek}
            onUpdateWeek={handleUpdateWeek}
            onOpenCopyModal={() => setIsCopyModalOpen(true)}
          />
        )}

        {currentView === 'roadmap' && (
          <MasterRoadmapView
            weeks={store.weeks}
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
      </main>

      {/* Copy Modal */}
      <CopyWeekModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        sourceWeek={activeWeek}
        totalWeeks={store.totalWeeks}
        onConfirmCopy={handleConfirmCopy}
      />

    </div>
  );
}
