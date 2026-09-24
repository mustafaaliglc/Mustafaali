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
  FileText,
  Target,
  Sparkles
} from 'lucide-react';
import { WeekPlan, ProgramItem } from '../types/schedule';
import { DEFAULT_TAGS } from '../data/initialData';

interface WeeklyScheduleViewProps {
  week: WeekPlan;
  onUpdateWeek: (updatedWeek: WeekPlan) => void;
  onOpenCopyModal: () => void;
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
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDriveUrl, setIsEditingDriveUrl] = useState(false);
  const [tempDriveUrl, setTempDriveUrl] = useState(week.driveFolderUrl || '');
  const [copiedDrive, setCopiedDrive] = useState(false);

  const items = week.items || [];
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.isCompleted).length;

  // Save Drive URL
  const handleSaveDriveUrl = () => {
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
    const updated = items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i));
    onUpdateWeek({ ...week, items: updated });
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    const updated = items.filter((i) => i.id !== itemId);
    onUpdateWeek({ ...week, items: updated });
  };

  // Duplicate item
  const handleDuplicateItem = (item: ProgramItem) => {
    const newItem: ProgramItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: item.text ? `${item.text} (Kopya)` : '',
      isCompleted: false,
    };
    onUpdateWeek({ ...week, items: [...items, newItem] });
  };

  // Add new item
  const handleAddItem = () => {
    const newItem: ProgramItem = {
      id: `item-${Date.now()}`,
      text: '', // Sen düzenleyeceksin diye boş bırakıldı
      tag: 'HTML & CSS',
      isCompleted: false,
    };
    onUpdateWeek({ ...week, items: [...items, newItem] });
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner: Week Header & Web Design Topic */}
      <div className="bg-[#110b27]/90 backdrop-blur-md border border-purple-800/40 rounded-2xl p-5 sm:p-6 shadow-xl shadow-purple-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Week Title & Topic */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/90 px-2.5 py-0.5 rounded-md border border-purple-700/60 shadow-xs">
                {week.weekNumber}. Hafta / 30 Hafta
              </span>
              <span className="text-xs text-purple-600">·</span>
              <span className="text-xs font-semibold text-purple-300">
                Mustafa Ali Güleç · Web Tasarımı
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={week.title}
                  onChange={(e) => onUpdateWeek({ ...week, title: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  className="text-xl sm:text-2xl font-bold text-white border-b-2 border-purple-500 focus:outline-none bg-purple-950/60 px-2 py-0.5 rounded"
                />
              ) : (
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                  title="Başlığı değiştirmek için tıklayın"
                >
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {week.title}
                  </h2>
                  <Edit2 className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>

            {/* Editable Week Topic / Focus */}
            <div className="flex items-center gap-2 pt-1 max-w-2xl">
              <Target className="w-4 h-4 text-purple-400 shrink-0" />
              <input
                type="text"
                value={week.topic || ''}
                onChange={(e) => onUpdateWeek({ ...week, topic: e.target.value })}
                placeholder="Bu haftanın web tasarımı konusu (örn: HTML Semantik Etiketler, CSS Flexbox & Grid, Figma Arayüz)..."
                className="w-full text-xs font-medium text-purple-100 placeholder:text-purple-400/60 bg-purple-950/50 hover:bg-purple-950/80 focus:bg-purple-950 border border-purple-800/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors shadow-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-purple-600/30 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Program Ekle</span>
            </button>

            <button
              onClick={onOpenCopyModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-200 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-750/60 rounded-xl transition-colors shadow-xs"
              title="Bu haftanın program yapısını diğer haftalara kopyala"
            >
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>Haftayı Kopyala</span>
            </button>
          </div>
        </div>

        {/* GOOGLE DRIVE SECTION */}
        <div className="mt-5 pt-4 border-t border-purple-900/40">
          <div className="bg-gradient-to-r from-purple-950/90 via-[#160d33] to-[#0d0724] rounded-xl p-4 border border-purple-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-purple-950/30">
            
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-black/40 rounded-xl shadow-xs border border-purple-700/50">
                <GoogleDriveIcon />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {week.driveTitle || `${week.weekNumber}. Hafta Google Drive Ders Klasörü`}
                  </h3>
                  {week.driveFolderUrl ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Drive Klasörü Bağlı
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                      Drive Linki Henüz Eklenmedi
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-purple-300/70 mt-0.5">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/30 transition-all active:scale-95"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Google Drive Klasörünü Aç</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>

                  <button
                    onClick={handleCopyDriveUrl}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 rounded-xl transition-colors shadow-xs"
                    title="Drive linkini kopyala"
                  >
                    {copiedDrive ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-400" />
                        <span className="hidden sm:inline">Kopyala</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setTempDriveUrl(week.driveFolderUrl || '');
                      setIsEditingDriveUrl(!isEditingDriveUrl);
                    }}
                    className="p-2 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 rounded-xl transition-colors shadow-xs"
                    title="Linki düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingDriveUrl(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-purple-200 bg-purple-900/60 hover:bg-purple-800/70 border border-purple-600/50 rounded-xl transition-colors shadow-xs"
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Google Drive Linki Ekle</span>
                </button>
              )}
            </div>
          </div>

          {/* Inline Editor for Drive URL */}
          {isEditingDriveUrl && (
            <div className="mt-2.5 p-3 bg-purple-950/90 border border-purple-600/60 rounded-xl space-y-2 animate-in fade-in duration-100">
              <label className="block text-xs font-semibold text-purple-200">
                {week.weekNumber}. Hafta Google Drive Klasör Linki:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={tempDriveUrl}
                  onChange={(e) => setTempDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="flex-1 text-xs bg-black/50 border border-purple-700/60 rounded-lg px-3 py-2 text-white placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSaveDriveUrl}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs transition-colors"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setIsEditingDriveUrl(false)}
                  className="px-3 py-2 text-xs font-medium text-purple-300 hover:text-white bg-purple-900/60 hover:bg-purple-900 rounded-lg transition-colors"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PROGRAM / DERSLER LISTESİ (SAAT VE SEANS OLMADAN, TEMİZ VE DÜZENLENEBİLİR) */}
      <div className="bg-[#110b27]/90 backdrop-blur-md border border-purple-800/40 rounded-2xl p-5 sm:p-6 shadow-xl shadow-purple-950/30 space-y-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{week.weekNumber}. Hafta Programı & Web Tasarımı Konuları</span>
              <span className="text-xs font-semibold text-purple-300 bg-purple-950/90 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
                {items.length} Madde
              </span>
            </h3>
            <p className="text-xs text-purple-300/70 mt-0.5">
              Programları düzenlemek için metin kutularına tıklayın. Dilediğiniz gibi ekleyip çıkarabilirsiniz.
            </p>
          </div>

          <button
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:text-white bg-purple-950/80 hover:bg-purple-900/80 border border-purple-700/60 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Madde Ekle</span>
          </button>
        </div>

        {/* Program items list */}
        {items.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-purple-900/50 rounded-xl bg-purple-950/20">
            <Sparkles className="w-8 h-8 text-purple-500/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-purple-200">Bu haftaya ait henüz program maddesi yok</p>
            <p className="text-xs text-purple-400/70 mt-0.5">Aşağıdaki butona tıklayarak dilediğiniz ders veya konuyu ekleyebilirsiniz</p>
            <button
              onClick={handleAddItem}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-600/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>İlk Program Maddesini Ekle</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`group rounded-xl border p-3.5 transition-all ${
                  item.isCompleted
                    ? 'bg-purple-950/30 border-purple-900/40 text-purple-400'
                    : 'bg-[#160e33]/70 hover:bg-[#1a113d] border-purple-800/40 hover:border-purple-600/60 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => handleUpdateItem(item.id, 'isCompleted', !item.isCompleted)}
                    className="text-purple-400 hover:text-emerald-400 transition-colors shrink-0"
                    title={item.isCompleted ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-600 group-hover:text-purple-400" />
                    )}
                  </button>

                  <span className="text-xs font-bold text-purple-400 bg-black/40 border border-purple-800/50 px-2 py-0.5 rounded-md shrink-0">
                    #{index + 1}
                  </span>

                  {/* Program Text (Kullanıcının dolduracağı ana alan - Boş bırakılmış) */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleUpdateItem(item.id, 'text', e.target.value)}
                      placeholder="Web tasarımı konusunu / programını buraya yazın (Örn: HTML5 Semantik Etiketler, CSS Flexbox Yapısı)..."
                      className={`w-full text-xs font-semibold px-3 py-2 rounded-lg bg-black/40 border border-purple-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-inner ${
                        item.isCompleted ? 'line-through text-purple-400/60 bg-black/60' : 'text-white placeholder:text-purple-400/50'
                      }`}
                    />
                  </div>

                  {/* Tag / Kategori */}
                  <div className="shrink-0 hidden sm:block">
                    <select
                      value={item.tag || 'HTML & CSS'}
                      onChange={(e) => handleUpdateItem(item.id, 'tag', e.target.value)}
                      className="text-xs font-medium text-purple-200 bg-black/40 border border-purple-800/50 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      {DEFAULT_TAGS.map((t) => (
                        <option key={t} value={t} className="bg-[#140c2e] text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duplicate / Delete Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDuplicateItem(item)}
                      className="p-1.5 text-purple-400 hover:text-white hover:bg-purple-900/50 rounded-lg transition-colors"
                      title="Çoğalt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-purple-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom add button */}
        {items.length > 0 && (
          <div className="pt-2">
            <button
              onClick={handleAddItem}
              className="w-full py-2.5 border border-dashed border-purple-800/50 hover:border-purple-500 bg-purple-950/30 hover:bg-purple-900/40 rounded-xl text-xs font-semibold text-purple-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Program Maddesi Ekle</span>
            </button>
          </div>
        )}

        {/* HAFTALIK SERBEST METİN / DETAY ALANI */}
        <div className="mt-6 pt-4 border-t border-purple-900/40">
          <label className="flex items-center gap-2 text-xs font-bold text-purple-200 mb-2">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Haftalık Genel Notlar, Kod Özetleri & Açıklamalar:</span>
          </label>
          <textarea
            rows={3}
            value={week.content || ''}
            onChange={(e) => onUpdateWeek({ ...week, content: e.target.value })}
            placeholder="Bu hafta için dilediğiniz ek açıklamaları, ders notlarını, kod snippet'lerini veya linkleri buraya serbestçe yazabilirsiniz..."
            className="w-full text-xs text-white bg-black/40 border border-purple-800/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-purple-400/50 resize-y"
          />
        </div>

      </div>

    </div>
  );
};
