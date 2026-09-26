import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Built-in intelligent response generator for Web Design and 30-week curriculum
function generateSmartFallbackResponse(
  query: string,
  weeks: any[] = [],
  activeWeekNum: number = 1
): string {
  const q = query.toLowerCase().trim();

  // 1. Week Specific Queries (e.g. "1. hafta", "hafta 5", "3. haftanın drive linki", "bu hafta ne var")
  const weekMatch = q.match(/(\d+)\s*\.?\s*hafta/) || q.match(/hafta\s*(\d+)/);
  if (weekMatch && weeks.length > 0) {
    const requestedWeekNum = parseInt(weekMatch[1], 10);
    const targetWeek = weeks.find((w: any) => w.weekNumber === requestedWeekNum);
    if (targetWeek) {
      let reply = `📅 **${targetWeek.weekNumber}. Hafta: ${targetWeek.title}**\n\n`;
      reply += `🎯 **Ana Konu:** ${targetWeek.topic || 'Web Tasarım Eğitimi'}\n\n`;
      
      const filledItems = (targetWeek.items || []).filter((i: any) => i.text && i.text.trim());
      if (filledItems.length > 0) {
        reply += `📝 **Haftalık Ders Planı:**\n`;
        filledItems.forEach((it: any) => {
          reply += `- ${it.completed ? '✅' : '📌'} ${it.text}\n`;
        });
        reply += `\n`;
      }

      if (targetWeek.driveFolderUrl) {
        reply += `📂 **Google Drive Ders & Kaynak Klasörü:**\n${targetWeek.driveFolderUrl}\n\nBu bağlantıdan haftaya ait kaynak kodları, ders videolarını ve tasarım dosyalarını indirebilirsiniz.`;
      } else {
        reply += `📂 Bu hafta için henüz Google Drive linki tanımlanmamış. Yönetici (Admin) panelinden klasör linkinizi ekleyebilirsiniz.`;
      }
      return reply;
    }
  }

  // 2. Active / Current Week
  if (q.includes('şu an') || q.includes('bu hafta') || q.includes('aktif hafta')) {
    const currentWeek = weeks.find((w: any) => w.weekNumber === activeWeekNum) || weeks[0];
    if (currentWeek) {
      let reply = `📍 **Şu Anda Seçili Hafta:** **${currentWeek.weekNumber}. Hafta - ${currentWeek.title}**\n\n`;
      reply += `🎯 **Konu:** ${currentWeek.topic || 'Web Tasarım Eğitimi'}\n\n`;
      if (currentWeek.driveFolderUrl) {
        reply += `📂 **Drive Klasörü:**\n${currentWeek.driveFolderUrl}\n\n`;
      }
      reply += `Diğer haftalar için *"5. hafta"*, *"12. hafta linki"* veya *"HTML nedir?"* gibi sorular sorabilirsiniz.`;
      return reply;
    }
  }

  // 3. Drive folders list / general drive question
  if (q.includes('drive') || q.includes('klasör') || q.includes('link') || q.includes('dosya') || q.includes('indir')) {
    const weeksWithDrive = weeks.filter((w: any) => !!w.driveFolderUrl);
    if (weeksWithDrive.length > 0) {
      let reply = `📂 **Google Drive Linki Bulunan Haftalar (${weeksWithDrive.length}/${weeks.length}):**\n\n`;
      weeksWithDrive.slice(0, 8).forEach((w: any) => {
        reply += `• **${w.weekNumber}. Hafta (${w.title}):**\n  ${w.driveFolderUrl}\n`;
      });
      if (weeksWithDrive.length > 8) {
        reply += `\n*(...ve ${weeksWithDrive.length - 8} hafta daha)*\n`;
      }
      reply += `\nİstediğiniz haftanın numarasını yazarak (örn: *"1. hafta"*) doğrudan o haftanın detaylarına ve Drive linkine ulaşabilirsiniz.`;
      return reply;
    } else {
      return `📂 Sistemde henüz kayıtlı Google Drive klasör linki bulunmuyor. Üst menüden **Yönetici (Admin)** girişini yaparak haftalık Google Drive linklerinizi kolayca kaydedebilirsiniz.`;
    }
  }

  // 4. Greetings
  if (q.includes('merhaba') || q.includes('selam') || q.includes('hey') || q === 'hi' || q === 'hello') {
    return `👋 **Merhaba! Ben Mustafa Ali Güleç Web Tasarımı & Drive Asistanınız.**\n\nSize şu konularda 7/24 yardımcı olabilirim:\n- 📅 **Haftalık Dersler:** *"1. hafta konusu ne?"*, *"15. hafta ders planı"*\n- 📂 **Google Drive Linkleri:** *"3. haftanın Drive klasörü"*\n- 💻 **Web Tasarım Konuları:** *"CSS Grid nedir?"*, *"Flexbox nasıl kullanılır?"*, *"Responsive tasarım kuralları"*\n\nNasıl yardımcı olabilirim?`;
  }

  // 5. HTML / CSS / JS / Web Design Technical Questions
  if (q.includes('html')) {
    return `🌐 **HTML (HyperText Markup Language):**\nWeb sayfalarının temel iskeletini ve semantik yapısını oluşturan işaretleme dilidir.\n\n✨ **Önemli Noktalar:**\n- Semantik etiketler (\`<header>\`, \`<main>\`, \`<article>\`, \`<footer>\`) SEO ve erişilebilirlik için kritiktir.\n- Form kontrolleri, bağlantılar (\`<a>\`) ve medya bileşenleri (\`<img>\`, \`<video>\`) ile kullanıcı arayüzü kurulur.\n\nProgramımızın 1. ve 2. haftalarında HTML temellerini ve modern semantik yapıları öğrenebilirsiniz!`;
  }

  if (q.includes('css') || q.includes('flex') || q.includes('grid')) {
    return `🎨 **CSS3 & Modern Düzenleme (Flexbox & Grid):**\nWeb sayfalarını görselleştiren, renklendiren ve duyarlı (responsive) hale getiren stil dilidir.\n\n🔥 **Önemli Kavramlar:**\n- **Flexbox:** Tek boyutlu (satır veya sütun) hizalama için idealdir (\`justify-content\`, \`align-items\`).\n- **CSS Grid:** İki boyutlu (satır + sütun) karmaşık sayfa şablonları için mükemmeldir.\n- **Responsive Tasarım:** \`@media\` sorguları ve \`rem\`/\`em\`/\`%\` birimleri ile tüm cihazlara uyum sağlar.\n\n3. ve 4. haftalarda CSS'in derinliklerine iniyoruz!`;
  }

  if (q.includes('javascript') || q.includes('js')) {
    return `⚡ **JavaScript (JS):**\nWeb sitelerine dinamizm, etkileşim, animasyon ve API entegrasyonu kazandıran temel programlama dilidir.\n\n🚀 **Kullanım Alanları:**\n- DOM Manipülasyonu ve Olay Dinleyicileri (\`addEventListener\`)\n- Asenkron İşlemler (\`async/await\`, \`fetch\` API)\n- Modern Framework'ler (React, Next.js, Vue)\n\nProgramımızın ileri haftalarında bol bol pratik projelerle JavaScript işlenmektedir.`;
  }

  if (q.includes('figma') || q.includes('tasarım') || q.includes('ui') || q.includes('ux')) {
    return `✨ **UI / UX & Figma Tasarımı:**\nKullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) modern web tasarımının kalbidir.\n\n📐 **Figma Avantajları:**\n- Auto-Layout ile duyarlı bileşenler tasarlama\n- Design System ve renk/tipografi token'ları oluşturma\n- İnteraktif prototipler ile kodlamadan önce test etme.`;
  }

  // 6. General Curriculum Overview
  if (q.includes('program') || q.includes('müfredat') || q.includes('kaç hafta') || q.includes('özet')) {
    return `📚 **Mustafa Ali Güleç - 30 Haftalık Web Tasarımı Programı:**\n\n- **Toplam Hafta:** 30 Hafta\n- **Başlangıç:** HTML5, CSS3, Tipografi ve Temel Tasarım\n- **Orta Seviye:** Flexbox, CSS Grid, Responsive Tasarım, Figma & UI/UX\n- **İleri Seviye:** JavaScript Temelleri, DOM, Modern Web Bileşenleri, Proje Geliştirme\n- **Bitirme:** Portfolyo oluşturma ve canlıya alma.\n\nDetaylı incelemek istediğiniz haftayı belirtebilirsiniz (Örn: *"10. hafta"*).`;
  }

  // 7. General Fallback
  return `🤖 **Web Tasarımı Asistanı:**\n\nSorunuzla ilgili size yardımcı olmak için buradayım! 30 haftalık web tasarımı programı hakkında şunları sorabilirsiniz:\n- *"1. hafta dersi ve Drive linki"* \n- *"Flexbox ile CSS Grid arasındaki fark nedir?"*\n- *"Google Drive klasörlerine nasıl erişirim?"*\n- *"Aktif haftanın detayları"*`;
}

// Chat endpoint with Gemini + Smart Fallback
app.post('/api/chat', async (req, res) => {
  const { messages, weeksContext, activeWeekNum } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Geçersiz mesaj formatı' });
  }

  const userMessages = messages.filter((m: any) => m.role === 'user');
  const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

  // If Gemini API is configured, try calling Gemini 2.5 Flash
  if (ai) {
    try {
      // Build curriculum knowledge context
      let contextSummary = '';
      if (weeksContext && Array.isArray(weeksContext)) {
        contextSummary = weeksContext
          .map((w: any) => {
            const drive = w.driveFolderUrl ? `Drive Linki: ${w.driveFolderUrl}` : 'Drive Linki: Henüz eklenmedi';
            const itemsText = (w.items || [])
              .filter((i: any) => i.text && i.text.trim())
              .map((i: any) => i.text)
              .join(', ');
            return `Hafta ${w.weekNumber}: "${w.title}" - Konu: "${w.topic || 'Belirtilmedi'}" | ${drive} ${itemsText ? '| İçerikler: ' + itemsText : ''}`;
          })
          .join('\n');
      }

      const systemInstruction = `Sen Mustafa Ali Güleç'in 30 Haftalık Web Tasarımı Programı'nın özel, samimi, uzman ve yardımsever yapay zeka asistanısın.

Görevin:
1. Kullanıcıya hangi haftanın Google Drive ders klasörüne veya programına ulaşmak istediğinde yardımcı olmak.
2. Kullanıcının sorduğu haftanın Drive klasör linkini açık ve net olarak vermek (Örn: https://drive.google.com/drive/folders/...).
3. Web tasarımı dersleri, HTML5, CSS3, Flexbox/Grid, Responsive tasarım, UI/UX, Figma ve JavaScript konularında profesyonel, anlaşılır ve eğitici cevaplar vermek.
4. Kullanıcı hangi haftayı sorarsa o haftanın konularını ve materyallerini özetlemek.
5. Şu an seçili olan hafta: ${activeWeekNum || 1}. Hafta.

Mevcut 30 Haftalık Program ve Drive Bağlantıları Verisi:
${contextSummary}

Cevaplama Kuralları:
- Samimi, profesyonel, Türkçe ve motive edici konuş.
- Linkleri açık ve tıklanabilir formatta paylaş.
- Cevaplarını gereksiz uzatmadan, anlaşılır ve şık tut.`;

      // Format messages for Gemini API
      let formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Trim any leading 'model' messages (Gemini requires first message to be from 'user')
      while (formattedContents.length > 0 && formattedContents[0].role === 'model') {
        formattedContents.shift();
      }

      if (formattedContents.length > 0) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const replyText = response.text;
        if (replyText && replyText.trim()) {
          return res.json({ reply: replyText });
        }
      }
    } catch (geminiError: any) {
      console.warn('Gemini API çağrısı başarısız, akıllı yerel yanıtlayıcıya geçiliyor:', geminiError.message || geminiError);
    }
  }

  // Fallback: Generate high quality intelligent response from curriculum and web design knowledge base
  const fallbackReply = generateSmartFallbackResponse(
    lastUserMessage,
    weeksContext || [],
    activeWeekNum || 1
  );

  return res.json({ reply: fallbackReply });
});

// Mount Vite middleware in development or serve static in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { 
      middlewareMode: true, 
      hmr: process.env.DISABLE_HMR !== 'true' 
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Web Tasarımı Sunucusu http://0.0.0.0:${port} adresinde çalışıyor`);
});
