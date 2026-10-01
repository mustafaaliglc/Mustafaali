import React from 'react';
import { ArrowLeft, Printer, Download, Sparkles, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { LaserBorderCard } from './LaserBorderCard';
import { NeonColorMode } from './NeonBackgroundCanvas';

interface PosterViewProps {
  onBack: () => void;
  neonColorMode?: NeonColorMode | 'off';
}

export const PosterView: React.FC<PosterViewProps> = ({ onBack, neonColorMode = 'blue' }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Controls Bar (hidden during print) */}
      <div className="print:hidden bg-[#080d1a]/95 backdrop-blur-xl border border-sky-900/50 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-sky-500/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950/90 border border-sky-800/50 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Program Görünümüne Dön</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resmi Tanıtım Afişi</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/afis.jpg"
            download="Mustafa_Ali_Gulec_Web_Tasarim_Afisi.jpg"
            className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-200 bg-[#0c1427] hover:bg-sky-950 border border-sky-800/50 hover:border-cyan-400 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Afişi İndir (HD)</span>
          </a>

          <button
            onClick={handlePrint}
            className="btn-electric inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_25px_rgba(0,210,255,0.6)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Yazdır / PDF Yap</span>
          </button>
        </div>
      </div>

      {/* Main Poster Presentation Card */}
      <LaserBorderCard
        neonColorMode={neonColorMode as ('blue' | 'green' | 'off')}
        speed="slow"
        active={true}
        innerClassName="p-4 sm:p-8"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Poster Image Container */}
          <div className="relative group max-w-md w-full rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.3)] border border-cyan-500/40 transition-transform duration-300 hover:scale-[1.02]">
            <img
              src="/afis.jpg"
              alt="Mustafa Ali Güleç - 30 Haftalık Web Tasarımı ve Kodlama Programı Afişi"
              className="w-full h-auto object-cover block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
              <span className="text-xs font-semibold text-cyan-300 bg-black/80 px-3 py-1.5 rounded-full border border-cyan-500/40 backdrop-blur-md">
                Mustafa Ali Güleç • 30 Haftalık Web Tasarımı
              </span>
            </div>
          </div>

          {/* Details & Highlights side */}
          <div className="flex-1 max-w-lg space-y-5 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-3">
                <ImageIcon className="w-3.5 h-3.5" />
                Özel Tasarım Afiş
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Mustafa Ali Güleç
              </h2>
              <p className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                30 Haftalık Web Tasarımı & Kodlama Yolculuğu
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Bu afiş, 30 haftalık web geliştirme eğitim serüveninizi görselleştirmek için özel olarak tasarlandı. HTML5 ve modern CSS temellerinden başlayarak, responsive tasarımlar, Figma arayüzleri, modern JavaScript ve portfolyo projelerine uzanan başarı yol haritasını temsil eder.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#091124] border border-sky-900/60 shadow-inner">
                <p className="text-xs text-sky-400 font-medium">Toplam Süre</p>
                <p className="text-base font-bold text-white mt-0.5">30 Hafta Planı</p>
              </div>
              <div className="p-3 rounded-xl bg-[#091124] border border-sky-900/60 shadow-inner">
                <p className="text-xs text-cyan-400 font-medium">Drive Entegrasyonu</p>
                <p className="text-base font-bold text-white mt-0.5">Bulut Arşivi</p>
              </div>
              <div className="p-3 rounded-xl bg-[#091124] border border-sky-900/60 shadow-inner">
                <p className="text-xs text-indigo-400 font-medium">Yapay Zeka</p>
                <p className="text-base font-bold text-white mt-0.5">Gemini Asistanı</p>
              </div>
              <div className="p-3 rounded-xl bg-[#091124] border border-sky-900/60 shadow-inner">
                <p className="text-xs text-emerald-400 font-medium">Tasarım & Kod</p>
                <p className="text-base font-bold text-white mt-0.5">Figma & HTML/JS</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="/afis.jpg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
              >
                <span>Afişi Yeni Sekmede Tam Boyut Gör</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </LaserBorderCard>
    </div>
  );
};
