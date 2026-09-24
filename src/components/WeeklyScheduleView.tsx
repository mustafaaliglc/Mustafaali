import React, { useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  FolderOpen,
  ExternalLink,
  Link,
  Check,
  Target,
  Sparkles,
  Lock
} from 'lucide-react';
import { WeekPlan, ProgramItem } from '../types/schedule';
import { DEFAULT_TAGS } from '../data/initialData';
import { LaserBorderCard } from './LaserBorderCard';

interface WeeklyScheduleViewProps {
  week: WeekPlan;
  onUpdateWeek: (updatedWeek: WeekPlan) => void;
  onOpenCopyModal: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  neonColorMode?: 'blue' | 'green' | 'off';
}

// Google Drive SVG Icon with official colors
const GoogleDriveIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
  </svg>
);

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  week,
  onUpdateWeek,
  onOpenCopyModal,
  isAdmin,
  onOpenAdminLogin,
  neonColorMode = 'blue',
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDriveUrl, setIsEditingDriveUrl] = useState(false);
  const [tempDriveUrl, setTempDriveUrl] = useState(week.driveFolderUrl || '');
  const [copiedDrive, setCopiedDrive] = useState(false);

  const items = week.items || [];

  // Save Drive URL (Admin only)
  const handleSaveDriveUrl = () => {
    if (!isAdmin) {
      onOpenAdminLogin();
      return;
    }
    onUpdateWeek({
      ...week,
      driveFolderUrl: tempDriveUrl.trim(),
      driveTitle: tempDriveUrl.trim()
        ? (week.driveTitle || `${week.weekNumber}. Hafta Web Tasarımı Drive Klasörü`)
        : '',
    });
    setIsEditingDriveUrl(false);
  };

  const handleCopyDriveUrl = () => {
    if (!week.driveFolderUrl) return;
    navigator.clipboard.writeText(week.driveFolderUrl);
    setCopiedDrive(true);
    setTimeout(() => setCopiedDrive(false), 2000);
  };

  // Inline update for an item
  const handleUpdateItem = (itemId: string, field: keyof ProgramItem, value: any) => {
    if (!isAdmin && field !== 'isCompleted') {
      onOpenAdminLogin();
      return;
    }
    const updated = items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i));
    onUpdateWeek({ ...week, items: updated });
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    if (!isAdmin) {
      onOpenAdminLogin();
      return;
    }
    const updated = items.filter((i) => i.id !== itemId);
    onUpdateWeek({ ...week, items: updated });
  };

  // Duplicate item
  const handleDuplicateItem = (item: ProgramItem) => {
    if (!isAdmin) {
      onOpenAdminLogin();
      return;
    }
    const duplicated: ProgramItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: `${item.text} (Kopya)`,
      isCompleted: false,
    };
    onUpdateWeek({ ...week, items: [...items, duplicated] });
  };

  // Add new item
  const handleAddItem = () => {
    if (!isAdmin) {
      onOpenAdminLogin();
      return;
    }
    const newItem: ProgramItem = {
      id: `item-${Date.now()}`,
      text: '',
      tag: 'HTML & CSS',
      isCompleted: false,
    };
    onUpdateWeek({ ...week, items: [...items, newItem] });
  };

  return (
    <div key={week.weekNumber} className="space-y-6 pb-20 animate-cinematic-week">
      
      {/* Top Banner: Week Header & Web Design Topic with Full Rotating Laser Border */}
      <LaserBorderCard
        neonColorMode={neonColorMode}
        speed="normal"
        active={true}
        innerClassName="p-5 sm:p-6 backdrop-blur-xl border border-sky-900/60"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Week Title & Topic */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/40 shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                {week.weekNumber}. Hafta / 30 Hafta
              </span>
              <span className="text-xs text-sky-800">·</span>
              <span className="text-xs font-semibold text-sky-300">
                Mustafa Ali Güleç · Web Tasarımı
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && isEditingTitle ? (
                <input
                  type="text"
                  value={week.title}
                  onChange={(e) => onUpdateWeek({ ...week, title: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  className="text-xl sm:text-2xl font-bold text-white border-b-2 border-cyan-400 focus:outline-none bg-sky-950/80 px-2 py-0.5 rounded"
                />
              ) : (
                <div
                  className={`flex items-center gap-2 group ${isAdmin ? 'cursor-pointer' : ''}`}
                  onClick={() => isAdmin && setIsEditingTitle(true)}
                  title={isAdmin ? 'Başlığı değiştirmek için tıklayın' : undefined}
                >
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    {week.title}
                  </h2>
                  {isAdmin && (
                    <Edit2 className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              )}
            </div>

            {/* Week Topic / Focus */}
            <div className="flex items-center gap-2 pt-1 max-w-2xl">
              <Target className="w-4 h-4 text-cyan-400 shrink-0" />
              {isAdmin ? (
                <input
                  type="text"
                  value={week.topic || ''}
                  onChange={(e) => onUpdateWeek({ ...week, topic: e.target.value })}
                  placeholder="Bu haftanın web tasarımı konusu (örn: HTML Semantik Etiketler, CSS Flexbox & Grid, Figma Arayüz)..."
                  className="w-full text-xs font-medium text-sky-100 placeholder:text-sky-500/60 bg-[#0c1427] hover:bg-[#101b33] focus:bg-[#0b1329] border border-sky-800/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner"
                />
              ) : (
                <div className="text-xs font-medium text-sky-200 bg-sky-950/30 border border-sky-900/40 rounded-lg px-3 py-1.5">
                  {week.topic ? (
                    <span>{week.topic}</span>
                  ) : (
                    <span className="text-sky-500/60 italic">Haftalık konu henüz belirtilmedi.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons with High-Impact Hover Animations */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin ? (
              <>
                <button
                  onClick={handleAddItem}
                  className="btn-electric inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-lg shadow-sky-900/40 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Program Ekle</span>
                </button>

                <button
                  onClick={onOpenCopyModal}
                  className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950/90 border border-sky-700/60 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:-translate-y-0.5 active:scale-95"
                  title="Bu haftanın program yapısını diğer haftalara kopyala"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:scale-115" />
                  <span>Haftayı Kopyala</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-sky-300 hover:text-white bg-[#0c1427] hover:bg-sky-950/80 border border-sky-800/40 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,210,255,0.25)] hover:-translate-y-0.5 active:scale-95"
                title="Programı düzenlemek için yönetici girişi yapın"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:rotate-12" />
                <span>Düzenlemek için Giriş Yap</span>
              </button>
            )}
          </div>
        </div>

        {/* GOOGLE DRIVE SECTION with Electric Neon Border & Glow */}
        <div className="mt-5 pt-4 border-t border-sky-950/70">
          <div className="bg-gradient-to-r from-[#091224] via-[#0c162d] to-[#080e1c] rounded-xl p-4 border border-sky-700/40 hover:border-cyan-400/60 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/60">
            
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 bg-black/60 rounded-xl shadow-md border border-sky-700/50 shrink-0">
                <GoogleDriveIcon />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {week.driveTitle || `${week.weekNumber}. Hafta Google Drive Ders Klasörü`}
                  </h3>
                  {week.driveFolderUrl ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Drive Klasörü Bağlı
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      Drive Linki Henüz Eklenmedi
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-sky-300/80 mt-0.5">
                  Web tasarımı ders kaynakları, örnek kodlar, Figma tasarımları ve haftalık materyaller
                </p>
              </div>
            </div>

            {/* Actions for Drive link */}
            <div className="flex items-center gap-2 flex-wrap">
              {week.driveFolderUrl ? (
                <>
                  <a
                    href={week.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-electric inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Google Drive Klasörünü Aç</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-90" />
                  </a>

                  <button
                    onClick={handleCopyDriveUrl}
                    className="group inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-sky-200 bg-[#0b1326] hover:bg-sky-950/90 border border-sky-700/50 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
                    title="Drive linkini kopyala"
                  >
                    {copiedDrive ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:scale-115" />
                        <span className="hidden sm:inline">Kopyala</span>
                      </>
                    )}
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setTempDriveUrl(week.driveFolderUrl || '');
                        setIsEditingDriveUrl(!isEditingDriveUrl);
                      }}
                      className="group p-2 text-xs font-medium text-sky-300 hover:text-white bg-[#0b1326] hover:bg-sky-950/90 border border-sky-700/50 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
                      title="Drive linkini düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
                    </button>
                  )}
                </>
              ) : (
                isAdmin ? (
                  <button
                    onClick={() => setIsEditingDriveUrl(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-cyan-200 bg-sky-950/70 hover:bg-sky-900/80 border border-sky-600/50 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:-translate-y-0.5 active:scale-95"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Google Drive Linki Ekle</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenAdminLogin}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-sky-400 hover:text-cyan-300 bg-black/40 border border-sky-900/40 rounded-xl transition-all"
                  >
                    <Lock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Yönetici Tarafından Eklenecektir</span>
                  </button>
                )
              )}
            </div>

          </div>

          {/* Drive URL Edit Form (Admin Only) */}
          {isAdmin && isEditingDriveUrl && (
            <div className="mt-3 p-4 bg-[#091224] rounded-xl border border-sky-600/50 animate-in fade-in duration-200 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" />
                  Google Drive Klasör Bağlantısı (URL)
                </span>
                <span className="text-[11px] text-sky-400/80">
                  Google Drive &gt; Paylaş &gt; Bağlantıyı Kopyala
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={tempDriveUrl}
                  onChange={(e) => setTempDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="flex-1 text-xs bg-black/60 border border-sky-700/60 rounded-xl px-3 py-2 text-white placeholder:text-sky-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDriveUrl}
                    className="btn-electric px-4 py-2 text-xs font-semibold text-white rounded-xl"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setIsEditingDriveUrl(false)}
                    className="px-3 py-2 text-xs font-medium text-sky-300 hover:text-white bg-black/40 border border-sky-800/50 rounded-xl transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </LaserBorderCard>

      {/* Program Items List Section with Full Rotating Laser Border */}
      <LaserBorderCard
        neonColorMode={neonColorMode}
        speed="normal"
        active={true}
        innerClassName="p-5 sm:p-6 backdrop-blur-xl border border-sky-900/50 space-y-4"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-950/70">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{week.weekNumber}. Hafta Programı & Web Tasarımı Konuları</span>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/90 border border-cyan-700/60 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                {items.length} Madde
              </span>
            </h3>
            <p className="text-xs text-sky-300/80 mt-0.5">
              {isAdmin
                ? 'Program maddelerini dilediğiniz gibi düzenleyebilir, ekleyebilir veya silebilirsiniz.'
                : 'Haftalık ders ve program maddeleri. Tamamladığınız maddeleri işaretleyebilirsiniz.'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleAddItem}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:text-white bg-sky-950/80 hover:bg-sky-900/80 border border-sky-700/60 hover:border-cyan-400 rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:scale-120" />
              <span>Madde Ekle</span>
            </button>
          )}
        </div>

        {/* Program items list */}
        {items.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-sky-900/40 rounded-xl bg-sky-950/20">
            <Sparkles className="w-8 h-8 text-cyan-400/50 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-semibold text-sky-200">Bu haftaya ait henüz program maddesi yok</p>
            {isAdmin ? (
              <button
                onClick={handleAddItem}
                className="btn-electric mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Program Maddesini Ekle</span>
              </button>
            ) : (
              <p className="text-xs text-sky-400/70 mt-1">Yönetici program içeriklerini ekleyecektir.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{ animation: `itemCascadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms both` }}
                className={`group rounded-xl border p-3.5 transition-all duration-200 backdrop-blur-md ${
                  item.isCompleted
                    ? 'bg-sky-950/20 border-sky-950/50 text-sky-400/70'
                    : 'bg-[#081226]/60 hover:bg-[#0c1a36]/85 border-sky-800/40 hover:border-cyan-400/80 shadow-md hover:shadow-[0_0_20px_rgba(0,210,255,0.22)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
                  
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => handleUpdateItem(item.id, 'isCompleted', !item.isCompleted)}
                    className="text-sky-400 hover:text-emerald-400 transition-colors shrink-0"
                    title={item.isCompleted ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-sky-600 group-hover:text-cyan-400 transition-colors" />
                    )}
                  </button>

                  <span className="text-xs font-bold text-cyan-400 bg-black/60 border border-sky-800/60 px-2 py-0.5 rounded-md shrink-0">
                    #{index + 1}
                  </span>

                  {/* Program Text (Editable for Admin, Displayed for Visitor) */}
                  <div className="flex-1">
                    {isAdmin ? (
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleUpdateItem(item.id, 'text', e.target.value)}
                        placeholder="Web tasarımı konusunu / programını buraya yazın..."
                        className={`w-full bg-transparent border-b border-transparent hover:border-sky-700/60 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm font-medium transition-colors ${
                          item.isCompleted ? 'line-through text-sky-500/60' : 'text-white'
                        }`}
                      />
                    ) : (
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          item.isCompleted ? 'line-through text-sky-500/60' : 'text-white'
                        }`}
                      >
                        {item.text || (
                          <span className="text-sky-500/50 italic">Boş program maddesi</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Tag badge or selector */}
                  <div className="shrink-0">
                    {isAdmin ? (
                      <select
                        value={item.tag}
                        onChange={(e) => handleUpdateItem(item.id, 'tag', e.target.value)}
                        className="text-[11px] font-semibold bg-[#070d1a] border border-sky-800/60 hover:border-cyan-400 text-cyan-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-xs"
                      >
                        {DEFAULT_TAGS.map((t) => (
                          <option key={t} value={t} className="bg-[#070d1a] text-white">
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[11px] font-semibold bg-[#070d1a] border border-sky-800/60 text-cyan-300 rounded-lg px-2.5 py-1">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Admin controls: Duplicate & Delete */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleDuplicateItem(item)}
                        className="p-1.5 text-sky-400 hover:text-cyan-300 hover:bg-sky-900/50 rounded-lg transition-colors"
                        title="Maddeyi kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-sky-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Maddeyi sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </LaserBorderCard>

    </div>
  );
};
