import React, { useState } from 'react';
import { X, Download, Sparkles, Check, ZoomIn } from 'lucide-react';

interface LogoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogoItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  filename: string;
  badge: string;
  palette: string;
}

const LOGOS: LogoItem[] = [
  {
    id: 'logo-1',
    title: 'Fütüristik Tipografik MAG',
    subtitle: 'Elektrik cyan ve neon mavi geçişli, keskin geometrik modern tasarım',
    src: '/src/assets/images/mag_tech_logo_1790842083736.jpg',
    filename: 'MAG-Logo-Futuristik-Tipografi.jpg',
    badge: 'Tasarım 1',
    palette: 'Neon Cyan & Obsidian',
  },
  {
    id: 'logo-2',
    title: 'Siber Monogram & Amblem',
    subtitle: 'Metalik krom bitişli, koruyucu altıgen siber kalkan ve M-A-G monogramı',
    src: '/src/assets/images/mag_symbol_logo_1790842093356.jpg',
    filename: 'MAG-Logo-Siber-Monogram.jpg',
    badge: 'Tasarım 2',
    palette: 'Elektrik Mavisi & Lazer',
  },
];

export const LogoDownloadModal: React.FC<LogoDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (logo: LogoItem) => {
    const link = document.createElement('a');
    link.href = logo.src;
    link.download = logo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedId(logo.id);
    setTimeout(() => {
      setDownloadedId(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090f20] border border-cyan-400/50 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.25)] p-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Glow corner effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-sky-900/60 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-sky-950 border border-cyan-500/40 rounded-full">
                Özel Tasarım Logo Galerisi
              </span>
              <span className="text-[11px] text-amber-300/90 font-medium">
                (Siteye eklenmedi • Sadece indirme için)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              MAG Logo Tasarımları
            </h2>
            <p className="text-xs text-sky-300/70 mt-0.5">
              İsteğiniz doğrultusunda logolar sitedeki başlığa uygulanmamıştır. Buradan dilediğiniz tasarımı yüksek çözünürlükte indirebilirsiniz.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sky-400 hover:text-white hover:bg-sky-900/50 rounded-xl transition-all cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Logo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 overflow-y-auto relative z-10">
          {LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="group relative flex flex-col rounded-xl bg-[#060a16] border border-sky-800/60 hover:border-cyan-400/70 p-3.5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,210,255,0.25)] hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-cyan-300 px-2 py-0.5 bg-sky-950/80 rounded-md border border-cyan-500/30">
                  {logo.badge}
                </span>
                <span className="text-[10px] text-sky-400/70">
                  {logo.palette}
                </span>
              </div>

              {/* Image Preview Container */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/60 border border-sky-900/40 mb-3 group/img">
                <img
                  src={logo.src}
                  alt={logo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Zoom overlay button */}
                <button
                  onClick={() => setZoomedImage(logo.src)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium cursor-pointer backdrop-blur-[2px]"
                >
                  <ZoomIn className="w-4 h-4 text-cyan-300" />
                  <span>Büyük Gör</span>
                </button>
              </div>

              {/* Details */}
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                {logo.title}
              </h3>
              <p className="text-[11px] text-sky-300/70 mt-1 line-clamp-2 leading-relaxed flex-grow">
                {logo.subtitle}
              </p>

              {/* Download Action Button */}
              <button
                onClick={() => handleDownload(logo)}
                className={`mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  downloadedId === logo.id
                    ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_20px_rgba(0,210,255,0.5)] active:scale-95'
                }`}
              >
                {downloadedId === logo.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>İndirildi!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Logoyu İndir (JPG)</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-sky-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-400/80 gap-2 relative z-10">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Yüksek çözünürlüklü dijital varlık (8K render)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-200 hover:text-white border border-sky-800 text-xs font-medium cursor-pointer transition-all"
          >
            Kapat
          </button>
        </div>

      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-xl max-h-[85vh] rounded-2xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(0,210,255,0.4)]">
            <img
              src={zoomedImage}
              alt="Büyük Logo Önizlemesi"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
