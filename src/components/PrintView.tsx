import React, { useState } from 'react';
import { Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
      <div className="print:hidden bg-[#110b27]/90 backdrop-blur-md border border-purple-800/40 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-purple-950/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-200 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Program Görünümüne Dön</span>
          </button>

          <div className="inline-flex rounded-xl bg-purple-950/60 p-1 border border-purple-800/40 text-xs">
            <button
              onClick={() => setPrintScope('current')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                printScope === 'current'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Yalnızca {activeWeekNum}. Hafta
            </button>
            <button
              onClick={() => setPrintScope('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                printScope === 'all'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Tüm 30 Hafta
            </button>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-600/30 transition-all"
        >
          <Printer className="w-4 h-4" />
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
