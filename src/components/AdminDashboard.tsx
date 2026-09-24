import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  FolderCheck, 
  FolderX, 
  ExternalLink, 
  Save, 
  Trash2, 
  Search, 
  Check, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { ProgramStore, WeekPlan } from '../types/schedule';

interface AdminDashboardProps {
  store: ProgramStore;
  onUpdateWeek: (updatedWeek: WeekPlan) => void;
  adminPin: string;
  onChangePin: (newPin: string) => void;
  onLogout: () => void;
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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  store,
  onUpdateWeek,
  adminPin,
  onChangePin,
  onLogout,
  onSelectWeek,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'hasDrive'>('all');

  // Local state for editing drive URLs
  const [editedUrls, setEditedUrls] = useState<{ [weekNum: number]: string }>(() => {
    const initial: { [key: number]: string } = {};
    store.weeks.forEach((w) => {
      initial[w.weekNumber] = w.driveFolderUrl || '';
    });
    return initial;
  });

  const [savedSuccessMap, setSavedSuccessMap] = useState<{ [weekNum: number]: boolean }>({});

  // PIN Change State
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  // Stats
  const totalWeeks = store.weeks.length;
  const driveCount = store.weeks.filter((w) => !!w.driveFolderUrl).length;
  const missingCount = totalWeeks - driveCount;

  // Handle single week drive url save
  const handleSaveWeekDrive = (week: WeekPlan) => {
    const url = (editedUrls[week.weekNumber] || '').trim();
    const updated: WeekPlan = {
      ...week,
      driveFolderUrl: url,
      driveTitle: url
        ? (week.driveTitle || `${week.weekNumber}. Hafta Web Tasarımı Drive Klasörü`)
        : '',
    };
    onUpdateWeek(updated);

    // Show temporary saved indicator
    setSavedSuccessMap((prev) => ({ ...prev, [week.weekNumber]: true }));
    setTimeout(() => {
      setSavedSuccessMap((prev) => ({ ...prev, [week.weekNumber]: false }));
    }, 2000);
  };

  // Clear single week drive url
  const handleClearWeekDrive = (week: WeekPlan) => {
    setEditedUrls((prev) => ({ ...prev, [week.weekNumber]: '' }));
    onUpdateWeek({
      ...week,
      driveFolderUrl: '',
      driveTitle: '',
    });
  };

  // Submit PIN Change
  const handleSubmitPinChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (oldPinInput !== adminPin) {
      setPinError('Mevcut PIN hatalı!');
      return;
    }

    if (newPinInput.length < 4) {
      setPinError('Yeni PIN en az 4 karakter olmalıdır!');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinError('Yeni PIN ve tekrarı eşleşmiyor!');
      return;
    }

    onChangePin(newPinInput);
    setPinSuccess('Yönetici PIN başarıyla güncellendi!');
    setOldPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => {
      setIsChangingPin(false);
      setPinSuccess('');
    }, 2000);
  };

  // Filtered weeks
  const filteredWeeks = store.weeks.filter((w) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      w.title.toLowerCase().includes(q) ||
      (w.topic || '').toLowerCase().includes(q) ||
      w.weekNumber.toString().includes(q);

    if (filterMode === 'missing' && !!w.driveFolderUrl) return false;
    if (filterMode === 'hasDrive' && !w.driveFolderUrl) return false;

    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner: Admin Profile & Actions */}
      <div className="bg-[#080d1a]/95 backdrop-blur-xl border border-sky-900/50 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-sky-500/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 border border-cyan-400/40 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Yönetici Paneli (Admin)
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Yönetici: {store.ownerName}
                </span>
              </div>
              <p className="text-xs text-sky-300/80 mt-0.5">
                Google Drive klasör bağlantılarını sadece buradan siz ekleyip düzenleyebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChangingPin(!isChangingPin)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950 border border-sky-700/60 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>PIN Değiştir</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-800/50 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* PIN Change Form Drawer */}
        {isChangingPin && (
          <form
            onSubmit={handleSubmitPinChange}
            className="mt-4 p-4 bg-[#091224] rounded-xl border border-sky-600/50 animate-in fade-in duration-200 space-y-3"
          >
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yönetici PIN Kodunu Değiştir</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-sky-300 font-semibold block mb-1">
                  Mevcut PIN
                </label>
                <input
                  type="password"
                  value={oldPinInput}
                  onChange={(e) => setOldPinInput(e.target.value)}
                  placeholder="Mevcut PIN"
                  className="w-full text-xs bg-black/60 border border-sky-800/60 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-sky-300 font-semibold block mb-1">
                  Yeni PIN
                </label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Yeni PIN (örn: 5824)"
                  className="w-full text-xs bg-black/60 border border-sky-800/60 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-sky-300 font-semibold block mb-1">
                  Yeni PIN (Tekrar)
                </label>
                <input
                  type="password"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Yeni PIN Tekrar"
                  className="w-full text-xs bg-black/60 border border-sky-800/60 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  required
                />
              </div>
            </div>

            {pinError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-800/50">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}
            {pinSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{pinSuccess}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="px-3 py-1.5 text-xs text-sky-300 hover:text-white bg-black/40 rounded-lg"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="btn-electric px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm"
              >
                PIN'i Kaydet
              </button>
            </div>
          </form>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-sky-950/70">
          <div className="bg-black/40 border border-sky-900/50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-950/80 border border-sky-700/50 text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-sky-400/80 font-medium">Toplam Program</span>
              <p className="text-sm font-bold text-white">{totalWeeks} Hafta</p>
            </div>
          </div>

          <div className="bg-black/40 border border-sky-900/50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <FolderCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-sky-400/80 font-medium">Drive Linki Ekli</span>
              <p className="text-sm font-bold text-emerald-400">{driveCount} Hafta</p>
            </div>
          </div>

          <div className="bg-black/40 border border-sky-900/50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-700/50 text-amber-400">
              <FolderX className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-sky-400/80 font-medium">Drive Linki Eksik</span>
              <p className="text-sm font-bold text-amber-400">{missingCount} Hafta</p>
            </div>
          </div>
        </div>

      </div>

      {/* Drive Links Management List */}
      <div className="bg-[#080d1a]/95 backdrop-blur-xl border border-sky-900/50 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-4 transition-all duration-300 hover:border-sky-500/50">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-sky-950/70">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <GoogleDriveIcon />
              <span>30 Hafta Google Drive Klasör Linkleri</span>
            </h3>
            <p className="text-xs text-sky-300/80 mt-0.5">
              Her haftanın Drive klasör linkini yapıştırıp "Kaydet" butonuna basarak anında güncelleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Hafta veya konu ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-black/60 border border-sky-800/60 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder:text-sky-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-44"
              />
            </div>

            {/* Filter buttons */}
            <div className="inline-flex rounded-xl bg-[#0b1326] p-1 border border-sky-900/60 text-[11px]">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterMode === 'all' ? 'btn-electric text-white font-semibold' : 'text-sky-300 hover:text-white'
                }`}
              >
                Tümü ({totalWeeks})
              </button>
              <button
                onClick={() => setFilterMode('missing')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterMode === 'missing' ? 'btn-electric text-white font-semibold' : 'text-sky-300 hover:text-white'
                }`}
              >
                Eksikler ({missingCount})
              </button>
              <button
                onClick={() => setFilterMode('hasDrive')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterMode === 'hasDrive' ? 'btn-electric text-white font-semibold' : 'text-sky-300 hover:text-white'
                }`}
              >
                Ekli ({driveCount})
              </button>
            </div>
          </div>
        </div>

        {/* List of Weeks */}
        <div className="space-y-3">
          {filteredWeeks.map((week) => {
            const currentVal = editedUrls[week.weekNumber] ?? (week.driveFolderUrl || '');
            const isSavedSuccess = savedSuccessMap[week.weekNumber];
            const isDifferent = (currentVal.trim() !== (week.driveFolderUrl || '').trim());

            return (
              <div
                key={week.weekNumber}
                className="bg-[#0b1224]/80 hover:bg-[#0e172e] border border-sky-900/40 hover:border-cyan-400/60 rounded-xl p-3.5 transition-all duration-200 shadow-md space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  
                  {/* Left: Week Info */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-sky-950/90 border border-sky-700/60 font-black text-xs text-cyan-300 flex items-center justify-center shrink-0 shadow-xs">
                      #{week.weekNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {week.title}
                        </span>
                        {week.topic && (
                          <span className="text-[11px] text-sky-300/90 font-medium">
                            · {week.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-sky-400/70">
                        {week.items?.length || 0} Program Maddesi
                      </span>
                    </div>
                  </div>

                  {/* Jump to Week Button */}
                  <button
                    onClick={() => onSelectWeek(week.weekNumber)}
                    className="group inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-white transition-colors self-start sm:self-auto"
                  >
                    <span>Haftalık Programda Gör</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                </div>

                {/* Drive URL Input Row */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={currentVal}
                      onChange={(e) =>
                        setEditedUrls((prev) => ({
                          ...prev,
                          [week.weekNumber]: e.target.value,
                        }))
                      }
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full text-xs bg-black/60 border border-sky-800/60 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder:text-sky-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono transition-all"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => handleSaveWeekDrive(week)}
                    className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0 ${
                      isSavedSuccess
                        ? 'bg-emerald-600 text-white'
                        : isDifferent
                        ? 'btn-electric text-white shadow-md'
                        : 'bg-[#0c1427] hover:bg-sky-950 text-sky-200 border border-sky-800/50'
                    }`}
                  >
                    {isSavedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Kaydedildi</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Kaydet</span>
                      </>
                    )}
                  </button>

                  {/* Test Link Button if exists */}
                  {currentVal.trim() && (
                    <a
                      href={currentVal.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-electric inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors shrink-0"
                      title="Drive klasörünü yeni sekmede test et"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Aç</span>
                    </a>
                  )}

                  {/* Clear Button */}
                  {currentVal.trim() && (
                    <button
                      onClick={() => handleClearWeekDrive(week)}
                      className="p-2 text-sky-400 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors shrink-0"
                      title="Linki Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
