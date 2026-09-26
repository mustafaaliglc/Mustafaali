import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ExternalLink, 
  FolderOpen, 
  Bot
} from 'lucide-react';
import { WeekPlan } from '../types/schedule';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatBotProps {
  weeks: WeekPlan[];
  activeWeekNum: number;
  onSelectWeek: (weekNum: number) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  weeks,
  activeWeekNum,
  onSelectWeek,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialWelcome: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: `Merhaba Mustafa Ali! 👋 Ben 30 Haftalık Web Tasarımı programı asistanınım.

Hangi haftanın Google Drive klasörünü veya ders materyallerini istersin? İster hafta numarası ver, ister web tasarımı (HTML, CSS, Figma vb.) konusunda merak ettiğin bir şeyi sor!`,
    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcome]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          activeWeekNum,
          weeksContext: weeks.map((w) => ({
            weekNumber: w.weekNumber,
            title: w.title,
            topic: w.topic,
            driveFolderUrl: w.driveFolderUrl,
            items: w.items,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok && !data.reply) {
        throw new Error(data.error || 'Yanıt alınamadı');
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || data.error || 'Cevap alındı.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('Sunucu yanıtı alınamadı, yerel asistan devreye giriyor:', err);
      
      // Smart Client-Side Instant Fallback
      const q = messageText.toLowerCase().trim();
      let fallbackText = '';

      const weekMatch = q.match(/(\d+)\s*\.?\s*hafta/) || q.match(/hafta\s*(\d+)/);
      if (weekMatch && weeks.length > 0) {
        const targetNum = parseInt(weekMatch[1], 10);
        const targetWeek = weeks.find((w) => w.weekNumber === targetNum);
        if (targetWeek) {
          fallbackText = `📅 **${targetWeek.weekNumber}. Hafta: ${targetWeek.title}**\n\n🎯 **Konu:** ${targetWeek.topic || 'Web Tasarım Eğitimi'}\n\n`;
          if (targetWeek.driveFolderUrl) {
            fallbackText += `📂 **Google Drive Klasörü:**\n${targetWeek.driveFolderUrl}\n\nBu linke tıklayarak ders dosyalarına ve kaynak kodlarına erişebilirsiniz.`;
          } else {
            fallbackText += `📂 Bu hafta için henüz Drive klasör linki eklenmemiş. Yönetici panelinden bağlantıyı ekleyebilirsiniz.`;
          }
        }
      }

      if (!fallbackText) {
        if (q.includes('merhaba') || q.includes('selam') || q.includes('hey')) {
          fallbackText = `👋 **Merhaba! Mustafa Ali Güleç Web Tasarımı Asistanınızım.**\n\nSize haftalık ders konuları, Google Drive linkleri ve web tasarım (HTML, CSS, JS) konularında yardımcı olabilirim. Nasıl yardımcı olabilirim?`;
        } else if (q.includes('drive') || q.includes('klasör') || q.includes('link')) {
          const withDrive = weeks.filter((w) => !!w.driveFolderUrl);
          if (withDrive.length > 0) {
            fallbackText = `📂 **Kayıtlı Drive Klasörleri (${withDrive.length} hafta):**\n\n`;
            withDrive.slice(0, 6).forEach((w) => {
              fallbackText += `• **${w.weekNumber}. Hafta:** ${w.driveFolderUrl}\n`;
            });
            fallbackText += `\nDetayını istediğiniz haftayı numarasıyla (örn: *"1. hafta"*) sorabilirsiniz.`;
          } else {
            fallbackText = `📂 Henüz sisteme bir Google Drive linki eklenmemiş. Üst menüdeki Yönetici Girişi'nden ekleyebilirsiniz.`;
          }
        } else if (q.includes('html')) {
          fallbackText = `🌐 **HTML (HyperText Markup Language):** Web sayfalarının yapı taşıdır. Semantik etiketler (\`<header>\`, \`<main>\`, \`<footer>\`) sayfa yapısını organize eder. Programın ilk haftalarında detaylıca işlenmektedir.`;
        } else if (q.includes('css') || q.includes('flex') || q.includes('grid')) {
          fallbackText = `🎨 **CSS3 & Sayfa Düzeni:** Web sayfalarını stillendirmek ve esnek (Flexbox / CSS Grid) mizanpajlar kurmak için kullanılır.`;
        } else if (q.includes('javascript') || q.includes('js')) {
          fallbackText = `⚡ **JavaScript:** Web sayfalarına etkileşim, animasyon ve veri yönetimi kazandıran temel dildir.`;
        } else {
          fallbackText = `🤖 **Asistan:** Sorunuzu aldım! 30 haftalık web tasarımı programında istediğiniz haftayı (örn: *"3. hafta"*, *"Drive linkleri"*, *"HTML nedir"*) sorabilirsiniz.`;
        }
      }

      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([initialWelcome]);
  };

  // Helper to parse text, markdown links and extract Google Drive buttons
  const renderMessageContent = (content: string) => {
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Combined parser
    const combinedRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
    let keyIdx = 0;

    while ((match = combinedRegex.exec(content)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${keyIdx++}`}>
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }

      const isMarkdownLink = !!match[1] && !!match[2];
      const linkLabel = isMarkdownLink ? match[1] : 'Bağlantıyı Aç';
      const linkUrl = isMarkdownLink ? match[2] : match[3].replace(/[),.]+$/, '');
      const isDrive = linkUrl.includes('drive.google.com');

      elements.push(
        <div key={`link-${keyIdx++}`} className="my-1.5 inline-block">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-electric inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95`}
          >
            {isDrive ? <FolderOpen className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
            <span>{isDrive ? `📁 ${linkLabel.includes('Drive') ? linkLabel : 'Google Drive Klasörünü Aç'}` : linkLabel}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      );

      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      elements.push(
        <span key={`text-end`}>
          {content.substring(lastIndex)}
        </span>
      );
    }

    return (
      <div className="space-y-1.5 whitespace-pre-wrap text-xs leading-relaxed">
        {elements}
      </div>
    );
  };

  const quickChips = [
    '📁 1. Hafta Drive Linki',
    `📌 ${activeWeekNum}. Haftanın Konusu Nedir?`,
    '💡 Web Tasarımı Çalışma Önerisi',
    '📂 Hangi haftaların Drive linki var?',
  ];

  return (
    <>
      {/* Floating Launcher Button in bottom corner with Electric Pulse */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="btn-electric group relative flex items-center gap-2.5 px-4 py-3 text-white rounded-2xl shadow-xl shadow-cyan-950/60 border border-cyan-400/50 transition-all hover:scale-105 active:scale-95"
            title="Web Tasarımı & Drive Asistanı"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#080d1a] animate-pulse" />
            </div>
            <span className="text-xs font-bold tracking-wide">
              Drive & Hafta Asistanı
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-[#080d1a]/95 backdrop-blur-xl border border-sky-600/50 rounded-3xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-sky-950/90 via-[#0a1226] to-[#080d1a] border-b border-sky-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl btn-electric text-white flex items-center justify-center shadow-md border border-cyan-300/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">
                    Web Tasarımı Asistanı
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-sky-300/80 font-medium">
                  Drive klasörleri & haftalık program rehberi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Sohbeti Temizle"
                className="p-1.5 text-sky-400 hover:text-white hover:bg-sky-900/40 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Kapat"
                className="p-1.5 text-sky-400 hover:text-white hover:bg-sky-900/40 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#060a14] border-b border-sky-950/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-sky-800">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                disabled={isLoading}
                className="text-[10px] font-semibold text-sky-200 bg-sky-950/70 hover:bg-sky-900/80 border border-sky-700/50 hover:border-cyan-400 rounded-full px-2.5 py-1 whitespace-nowrap transition-all shadow-xs shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-sky-800/60 bg-[#070b17]/60">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                      isUser
                        ? 'btn-electric text-white rounded-br-none border border-cyan-300/40'
                        : 'bg-[#0b1328]/90 text-sky-100 rounded-bl-none border border-sky-800/60 shadow-black/40'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-sky-800/40 text-[10px] font-bold text-cyan-300">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>AI Asistan</span>
                      </div>
                    )}

                    {renderMessageContent(msg.content)}

                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        isUser ? 'text-sky-100/70' : 'text-sky-400/60'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-[#0b1328]/90 text-cyan-300 rounded-2xl rounded-bl-none p-3 border border-sky-800/50 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span className="text-xs font-medium">Asistan yanıt hazırlıyor...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#050912] border-t border-sky-900/50 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Örn: 1. haftanın drive dosyasını ver..."
              disabled={isLoading}
              className="flex-1 bg-black/60 border border-sky-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-sky-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all ${
                !inputMessage.trim() || isLoading
                  ? 'bg-sky-950/30 text-sky-800/40 cursor-not-allowed'
                  : 'btn-electric text-white shadow-md active:scale-95'
              }`}
              title="Gönder"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
