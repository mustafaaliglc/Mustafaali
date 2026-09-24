import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  ExternalLink,
  Target,
  Sparkles,
  FolderCheck
} from 'lucide-react';
import { WeekPlan } from '../types/schedule';

interface MasterRoadmapViewProps {
  weeks: WeekPlan[];
  onSelectWeek: (weekNum: number) => void;
}

// Google Drive SVG Icon
const GoogleDriveIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
  </svg>
);

export const MasterRoadmapView: React.FC<MasterRoadmapViewProps> = ({
  weeks,
  onSelectWeek,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'filled' | 'drive'>('all');

  // Filter weeks
  const filteredWeeks = weeks.filter((week) => {
    const q = searchTerm.toLowerCase();
    const titleMatch = (week.title || '').toLowerCase().includes(q);
    const topicMatch = (week.topic || '').toLowerCase().includes(q);
    const contentMatch = (week.content || '').toLowerCase().includes(q);
    const itemMatch = (week.items || []).some((i) => (i.text || '').toLowerCase().includes(q));

    const matchesSearch = !q || titleMatch || topicMatch || contentMatch || itemMatch;

    const filledCount = (week.items || []).filter((i) => i.text && i.text.trim() !== '').length;

    if (filterMode === 'filled' && filledCount === 0) return false;
    if (filterMode === 'drive' && !week.driveFolderUrl) return false;

    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="bg-[#080d1a]/95 backdrop-blur-xl border border-sky-900/50 rounded-2xl p-6 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-sky-500/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded border border-cyan-500/50 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                30 Hafta Listesi
              </span>
              <span className="text-xs text-sky-800">·</span>
              <span className="text-xs font-semibold text-sky-300">Mustafa Ali Güleç</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              30 Haftalık Web Tasarımı Müfredatı
            </h2>
            <p className="text-xs text-sky-300/80 mt-0.5">
              Tüm 30 haftayı tek ekranda inceleyin, Google Drive bağlantılarını görün ve düzenlemek için tıklayın.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Konu veya program ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-black/60 border border-sky-800/60 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-2 text-white placeholder:text-sky-500/60 focus:bg-black/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-56 shadow-sm transition-all"
              />
            </div>

            <div className="inline-flex rounded-xl bg-[#0b1326] p-1 border border-sky-900/60 shadow-inner">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  filterMode === 'all'
                    ? 'btn-electric text-white shadow-sm'
                    : 'text-sky-300 hover:text-white hover:bg-sky-900/40'
                }`}
              >
                Tümü (30)
              </button>
              <button
                onClick={() => setFilterMode('drive')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  filterMode === 'drive'
                    ? 'btn-electric text-white shadow-sm'
                    : 'text-sky-300 hover:text-white hover:bg-sky-900/40'
                }`}
              >
                Drive Olanlar
              </button>
              <button
                onClick={() => setFilterMode('filled')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  filterMode === 'filled'
                    ? 'btn-electric text-white shadow-sm'
                    : 'text-sky-300 hover:text-white hover:bg-sky-900/40'
                }`}
              >
                Dolu Olanlar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 30 Weeks Grid with Electric Blue cards and hover lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeeks.map((week) => {
          const items = week.items || [];

          return (
            <div
              key={week.weekNumber}
              onClick={() => onSelectWeek(week.weekNumber)}
              className="group bg-[#080d1a]/90 hover:bg-[#0b1328] border border-sky-900/45 hover:border-cyan-400/80 rounded-2xl p-4 shadow-xl shadow-black/70 hover:shadow-[0_0_25px_rgba(0,210,255,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between hover-lift hover:scale-[1.02]"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 group-hover:btn-electric group-hover:text-white px-2.5 py-1 rounded-lg border border-cyan-500/40 transition-all duration-200">
                    Hafta {week.weekNumber}
                  </span>

                  <span className="text-[11px] font-semibold text-sky-400/80 bg-black/60 border border-sky-900/50 px-2 py-0.5 rounded">
                    {items.length} Madde
                  </span>
                </div>

                {/* Week Title */}
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {week.title}
                </h3>

                {/* Topic / Web Design Focus */}
                <p className="text-xs text-sky-200/80 line-clamp-2 mt-1 min-h-[34px]">
                  {week.topic ? (
                    <span className="flex items-start gap-1">
                      <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{week.topic}</span>
                    </span>
                  ) : (
                    <span className="text-sky-500/50 italic">
                      Web tasarımı konusu henüz eklenmedi
                    </span>
                  )}
                </p>

                {/* Google Drive Status */}
                {week.driveFolderUrl ? (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 shadow-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <GoogleDriveIcon />
                      <span className="truncate">Google Drive Klasörü</span>
                    </div>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </div>
                ) : (
                  <div className="mt-2.5 text-[11px] text-sky-500/50 bg-black/40 px-2.5 py-1.5 rounded-lg border border-sky-950">
                    Drive linki henüz eklenmedi
                  </div>
                )}

                {/* Items preview */}
                <div className="mt-3 pt-2.5 border-t border-sky-950/60 space-y-1">
                  {items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-sky-300/70">
                      <span className="text-sky-500 font-mono text-[10px]">#{idx + 1}</span>
                      <span className="truncate text-sky-200">
                        {item.text ? item.text : <span className="text-sky-500/50 italic">Boş</span>}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-[10px] text-sky-400/60 text-right">
                      +{items.length - 3} madde daha...
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-2.5 border-t border-sky-950/50 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-all">
                <span>Haftayı Düzenle</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
