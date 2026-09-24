import React, { useState } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { ProgramStore } from '../types/schedule';

interface PrintViewProps {
  store: ProgramStore;
  activeWeekNum: number;
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  store,
  activeWeekNum,
  onBack,
}) => {
  const [printScope, setPrintScope] = useState<'current' | 'all'>('current');

  const weeksToPrint = printScope === 'current'
    ? store.weeks.filter((w) => w.weekNumber === activeWeekNum)
    : store.weeks;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Controls (hidden during print) */}
      <div className="print:hidden bg-[#080d1a]/95 backdrop-blur-xl border border-sky-900/50 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-sky-500/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950/90 border border-sky-800/50 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Program Görünümüne Dön</span>
          </button>

          <div className="inline-flex rounded-xl bg-[#0b1326] p-1 border border-sky-900/60 text-xs">
            <button
              onClick={() => setPrintScope('current')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                printScope === 'current'
                  ? 'btn-electric text-white shadow-sm font-semibold'
                  : 'text-sky-300 hover:text-white'
              }`}
            >
              Yalnızca {activeWeekNum}. Hafta
            </button>
            <button
              onClick={() => setPrintScope('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                printScope === 'all'
                  ? 'btn-electric text-white shadow-sm font-semibold'
                  : 'text-sky-300 hover:text-white'
              }`}
            >
              Tüm 30 Hafta
            </button>
          </div>
        </div>

        {/* Yazdır Butonu with shimmer & hover lift */}
        <button
          onClick={handlePrint}
          className="btn-electric group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 transition-transform group-hover:scale-120 group-hover:-rotate-12" />
          <span>Yazdır / PDF Olarak Kaydet</span>
        </button>
      </div>

      {/* Printable Document Container */}
      <div className="space-y-8 print:space-y-12">
        {weeksToPrint.map((week) => {
          const items = week.items || [];

          return (
            <div
              key={week.weekNumber}
              className="bg-white text-slate-900 border border-slate-300 print:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md print:shadow-none print:break-after-page"
            >
              {/* Header banner */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {store.ownerName}
                  </h1>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    30 Haftalık Web Tasarımı Müfredatı
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-slate-900 px-3 py-1 rounded">
                    {week.weekNumber}. Hafta
                  </span>
                  <div className="text-xs font-medium text-slate-600 mt-1">
                    {items.length} Program Maddesi
                  </div>
                </div>
              </div>

              {/* Title, Topic & Drive */}
              <div className="mb-6 bg-slate-50 print:bg-white p-3.5 rounded-lg border border-slate-200">
                <h2 className="text-base font-bold text-slate-900">{week.title}</h2>
                {week.topic && (
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>Hafta Konusu:</strong> {week.topic}
                  </p>
                )}
                {week.driveFolderUrl && (
                  <p className="text-xs text-blue-700 mt-1 font-mono break-all">
                    <strong>Google Drive Klasörü:</strong> {week.driveFolderUrl}
                  </p>
                )}
                {week.content && (
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Haftalık Notlar / Açıklama:</strong> {week.content}
                  </p>
                )}
              </div>

              {/* Items List (Clean checklist / topics) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                  Program Maddeleri & Dersler:
                </h3>
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Program maddesi eklenmedi.</p>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-slate-400 rounded flex items-center justify-center text-[10px]">
                          {item.isCompleted ? '✓' : ''}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">#{idx + 1}</span>
                        <span className={`font-medium ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.text || <span className="text-slate-400 italic">Boş</span>}
                        </span>
                      </div>
                      {item.tag && (
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
