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
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Chat endpoint with Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, weeksContext, activeWeekNum } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Geçersiz mesaj formatı' });
    }

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

    const systemInstruction = `Sen Mustafa Ali Güleç'in 30 Haftalık Web Tasarımı Programı'nın özel, zeki ve yardımsever yapay zeka asistanısın.

Görevin:
1. Kullanıcıya hangi haftanın Google Drive ders klasörüne, ders materyallerine veya programına ulaşmak istediğini sormak ve yardımcı olmak.
2. Kullanıcının istediği haftanın Drive linkini net bir şekilde vermek (Örn: 1. Hafta Drive Linki: https://drive.google.com/drive/folders/1IPqE7_sRv7mMc5hRAhJifFiC42VtB-K1?hl=tr).
3. Web tasarımı dersleri, HTML5, CSS3, Flexbox/Grid, Responsive tasarım, UI/UX, Figma ve JavaScript konularında rehberlik etmek.
4. Kullanıcı hangi haftayı sorarsa o haftanın konularını ve materyallerini özetlemek.
5. Şu an seçili olan hafta: ${activeWeekNum || 1}. Hafta.

Mevcut 30 Haftalık Program ve Drive Bağlantıları Verisi:
${contextSummary}

Cevaplama Kuralları:
- Samimi, profesyonel, motive edici ve Türkçe konuş.
- Linkleri açık ve tıklanabilir formatta paylaş.
- Cevaplarını gereksiz uzatmadan, anlaşılır ve şık tut.`;

    // Map conversation history to contents for Gemini
    // Ensure contents start with 'user' role (Gemini requires the first turn to be 'user')
    let formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Trim any leading 'model' messages (e.g., initial welcome greeting)
    while (formattedContents.length > 0 && formattedContents[0].role === 'model') {
      formattedContents.shift();
    }

    if (formattedContents.length === 0) {
      return res.status(400).json({ error: 'Kullanıcı mesajı bulunamadı.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Üzgünüm, şu anda yanıt oluşturamadım.';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini API Hatası:', error);

    // Fallback: If Gemini API fails or key is missing, provide a smart local response from curriculum context
    const { messages, weeksContext, activeWeekNum } = req.body || {};
    const lastUserMessage = (messages && messages.slice().reverse().find((m: any) => m.role === 'user')?.content) || '';
    const userQueryLower = lastUserMessage.toLowerCase();

    // Check if user is asking for a specific week or drive folder
    const weekMatch = userQueryLower.match(/(\d+)\s*\.?\s*hafta/);
    if (weekMatch && weeksContext && Array.isArray(weeksContext)) {
      const requestedWeekNum = parseInt(weekMatch[1], 10);
      const targetWeek = weeksContext.find((w: any) => w.weekNumber === requestedWeekNum);
      if (targetWeek) {
        let reply = `📅 **${targetWeek.weekNumber}. Hafta: ${targetWeek.title}**\n\n🎯 **Konu:** ${targetWeek.topic || 'Belirtilmedi'}\n\n`;
        if (targetWeek.driveFolderUrl) {
          reply += `📂 **Google Drive Klasörü:**\n${targetWeek.driveFolderUrl}\n\nBu linke tıklayarak ders kayıtlarına ve kaynak kodlarına erişebilirsiniz!`;
        } else {
          reply += `📂 Bu hafta için henüz Google Drive linki eklenmemiş. Yönetici panelinden link ekleyebilirsiniz.`;
        }
        return res.json({ reply });
      }
    }

    return res.status(500).json({
      error: error.message || 'Gemini servisiyle iletişim kurulurken bir hata oluştu.',
    });
  }
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
