import { ProgramStore, WeekPlan, ProgramItem } from '../types/schedule';

export const WEEK_1_DRIVE_URL = 'https://drive.google.com/drive/folders/1MY7fXtKi7LvN9KKsEzZeYwjRhXVHF1_I?hl=tr';
export const WEEK_2_DRIVE_URL = 'https://drive.google.com/drive/folders/1MY7fXtKi7LvN9KKsEzZeYwjRhXVHF1_I?hl=tr';
export const OLD_WEEK_1_DRIVE_URL = 'https://drive.google.com/drive/folders/1IPqE7_sRv7mMc5hRAhJifFiC42VtB-K1?hl=tr';
export const WEEK_2_POSTER_IMAGE = '/afis.jpg';
export const WEEK_3_VERCEL_URL = 'https://mustafaali2.vercel.app';

export const DEFAULT_TAGS = [
  'HTML & CSS',
  'JavaScript',
  'UI / UX & Figma',
  'Web Projesi',
  'Responsive Tasarım',
  'Genel',
];

export function generateDefaultItems(weekNumber: number): ProgramItem[] {
  if (weekNumber === 2) {
    return [
      {
        id: 'w2-item-1',
        text: 'Mustafa Ali Güleç 38 Haftalık Web Tasarımı ve Kodlama Özel Afişi (/afis.jpg)',
        tag: 'UI / UX & Figma',
        isCompleted: true,
      },
      {
        id: 'w2-item-2',
        text: `2. Hafta Google Drive Klasörü: ${WEEK_2_DRIVE_URL}`,
        tag: 'Web Projesi',
        isCompleted: true,
      },
      {
        id: 'w2-item-3',
        text: 'Tasarım Hiyerarşisi, Tipografi & Renk Paleti İncelemesi',
        tag: 'HTML & CSS',
        isCompleted: false,
      },
    ];
  }

  if (weekNumber === 3) {
    return [
      {
        id: 'w3-item-1',
        text: 'Canlı Web Projesi Yayını: https://mustafaali2.vercel.app',
        tag: 'Web Projesi',
        isCompleted: true,
      },
      {
        id: 'w3-item-2',
        text: 'Vercel Deployment & Canlı Yayın Testleri',
        tag: 'HTML & CSS',
        isCompleted: false,
      },
      {
        id: 'w3-item-3',
        text: 'Responsive Arayüz ve Tasarım İncelemesi',
        tag: 'Web Projesi',
        isCompleted: false,
      },
    ];
  }

  // Kullanıcı düzenleyecek diye boş bırakılmış temiz program maddeleri (saat/seans yok)
  return [
    {
      id: `w${weekNumber}-item-1`,
      text: '', // Sen düzenleyeceksin diye boş bırakıldı
      tag: 'HTML & CSS',
      isCompleted: false,
    },
    {
      id: `w${weekNumber}-item-2`,
      text: '',
      tag: 'HTML & CSS',
      isCompleted: false,
    },
    {
      id: `w${weekNumber}-item-3`,
      text: '',
      tag: 'Web Projesi',
      isCompleted: false,
    },
  ];
}

export function generateEmptyWeek(weekNumber: number): WeekPlan {
  const isWeek1 = weekNumber === 1;
  const isWeek2 = weekNumber === 2;
  const isWeek3 = weekNumber === 3;
  return {
    weekNumber,
    title: `${weekNumber}. Hafta`,
    topic: isWeek1 
      ? 'Web Tasarımına Giriş & HTML/CSS' 
      : isWeek2
        ? 'Özel Tasarım Afiş & Görsel Yol Haritası'
        : isWeek3 
          ? 'Canlı Web Projesi & Vercel Dağıtımı' 
          : '',
    driveFolderUrl: isWeek1 
      ? WEEK_1_DRIVE_URL 
      : isWeek2
        ? WEEK_2_DRIVE_URL
        : isWeek3 
          ? WEEK_3_VERCEL_URL 
          : '',
    driveTitle: isWeek1 
      ? '1. Hafta Web Tasarımı Drive Klasörü' 
      : isWeek2
        ? '2. Hafta Web Tasarımı Drive Klasörü'
        : isWeek3 
          ? '3. Hafta Canlı Web Projesi (mustafaali2.vercel.app)' 
          : '',
    content: isWeek2 
      ? '2. Hafta Özel Afişi: /afis.jpg' 
      : isWeek3 
        ? 'Canlı Web Projesi: https://mustafaali2.vercel.app' 
        : '',
    items: generateDefaultItems(weekNumber),
  };
}

export function createInitialProgramStore(): ProgramStore {
  const weeks: WeekPlan[] = [];
  for (let i = 1; i <= 38; i++) {
    weeks.push(generateEmptyWeek(i));
  }

  return {
    ownerName: 'Mustafa Ali Güleç',
    programTitle: '38 Haftalık Web Tasarımı Programı',
    totalWeeks: 38,
    weeks,
    lastUpdated: new Date().toISOString(),
  };
}

const STORAGE_KEY = 'mustafa_ali_gulec_30_hafta_web_tasarim_v4_dark';

export function loadProgramFromStorage(): ProgramStore {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.weeks)) {
        // Automatically extend to 38 weeks if user has fewer (e.g. 30 weeks)
        if (parsed.weeks.length < 38) {
          for (let i = parsed.weeks.length + 1; i <= 38; i++) {
            parsed.weeks.push(generateEmptyWeek(i));
          }
        }
        parsed.totalWeeks = 38;
        if (parsed.programTitle) {
          parsed.programTitle = parsed.programTitle.replace(/30/, '38');
        }

        const OLD_DRIVE_KEY = '1IPqE7_sRv7mMc5hRAhJifFiC42VtB-K1';
        // 1. Hafta Google Drive Klasörü (Yeni link ekle, eskisini kaldır)
        if (!parsed.weeks[0].driveFolderUrl || parsed.weeks[0].driveFolderUrl.includes(OLD_DRIVE_KEY)) {
          parsed.weeks[0].driveFolderUrl = WEEK_1_DRIVE_URL;
          parsed.weeks[0].driveTitle = '1. Hafta Web Tasarımı Drive Klasörü';
        }

        // Genel tarama: Herhangi bir haftadaki eski drive linkini yeni link ile güncelle
        parsed.weeks.forEach((w: WeekPlan) => {
          if (w.driveFolderUrl && w.driveFolderUrl.includes(OLD_DRIVE_KEY)) {
            w.driveFolderUrl = WEEK_1_DRIVE_URL;
          }
          if (w.content && w.content.includes(OLD_DRIVE_KEY)) {
            w.content = w.content.split(OLD_DRIVE_KEY).join('1MY7fXtKi7LvN9KKsEzZeYwjRhXVHF1_I');
          }
          if (w.items) {
            w.items.forEach((it: ProgramItem) => {
              if (it.text && it.text.includes(OLD_DRIVE_KEY)) {
                it.text = it.text.split(OLD_DRIVE_KEY).join('1MY7fXtKi7LvN9KKsEzZeYwjRhXVHF1_I');
              }
            });
          }
        });

        // 2. Hafta Özel Tasarım Afişi ve Google Drive Klasörü
        if (parsed.weeks[1]) {
          parsed.weeks[1].driveFolderUrl = WEEK_2_DRIVE_URL;
          parsed.weeks[1].driveTitle = '2. Hafta Web Tasarımı Drive Klasörü';

          if (!parsed.weeks[1].topic || parsed.weeks[1].topic === '') {
            parsed.weeks[1].topic = 'Özel Tasarım Afiş & Görsel Yol Haritası';
          }
          if (!parsed.weeks[1].content || parsed.weeks[1].content === '') {
            parsed.weeks[1].content = '2. Hafta Özel Afişi: /afis.jpg';
          }
          if (!parsed.weeks[1].items || parsed.weeks[1].items.length === 0) {
            parsed.weeks[1].items = generateDefaultItems(2);
          } else {
            const hasPoster = parsed.weeks[1].items.some((it: ProgramItem) =>
              it.text && (it.text.includes('afis.jpg') || it.text.toLowerCase().includes('afiş'))
            );
            if (!hasPoster) {
              if (!parsed.weeks[1].items[0].text || parsed.weeks[1].items[0].text.trim() === '') {
                parsed.weeks[1].items[0].text = 'Mustafa Ali Güleç 38 Haftalık Web Tasarımı ve Kodlama Özel Afişi (/afis.jpg)';
                parsed.weeks[1].items[0].tag = 'UI / UX & Figma';
                parsed.weeks[1].items[0].isCompleted = true;
              } else {
                parsed.weeks[1].items.unshift({
                  id: `w2-item-afis-${Date.now()}`,
                  text: 'Mustafa Ali Güleç 38 Haftalık Web Tasarımı ve Kodlama Özel Afişi (/afis.jpg)',
                  tag: 'UI / UX & Figma',
                  isCompleted: true,
                });
              }
            }

            const hasDrive = parsed.weeks[1].items.some((it: ProgramItem) =>
              it.text && it.text.includes('1MY7fXtKi7LvN9KKsEzZeYwjRhXVHF1_I')
            );
            if (!hasDrive) {
              parsed.weeks[1].items.splice(1, 0, {
                id: `w2-item-drive-${Date.now()}`,
                text: `2. Hafta Google Drive Klasörü: ${WEEK_2_DRIVE_URL}`,
                tag: 'Web Projesi',
                isCompleted: true,
              });
            }
          }
        }

        // 3. Hafta Canlı Vercel linki (mustafaali2.vercel.app)
        if (parsed.weeks[2]) {
          if (!parsed.weeks[2].driveFolderUrl || parsed.weeks[2].driveFolderUrl === '') {
            parsed.weeks[2].driveFolderUrl = WEEK_3_VERCEL_URL;
            parsed.weeks[2].driveTitle = '3. Hafta Canlı Web Projesi (mustafaali2.vercel.app)';
          }
          if (!parsed.weeks[2].topic || parsed.weeks[2].topic === '') {
            parsed.weeks[2].topic = 'Canlı Web Projesi & Vercel Dağıtımı';
          }
          if (!parsed.weeks[2].items || parsed.weeks[2].items.length === 0) {
            parsed.weeks[2].items = generateDefaultItems(3);
          } else {
            const hasVercel = parsed.weeks[2].items.some((it: ProgramItem) =>
              it.text && it.text.includes('mustafaali2.vercel.app')
            );
            if (!hasVercel) {
              if (!parsed.weeks[2].items[0].text || parsed.weeks[2].items[0].text.trim() === '') {
                parsed.weeks[2].items[0].text = 'Canlı Web Projesi Yayını: https://mustafaali2.vercel.app';
                parsed.weeks[2].items[0].tag = 'Web Projesi';
                parsed.weeks[2].items[0].isCompleted = true;
              } else {
                parsed.weeks[2].items.unshift({
                  id: `w3-item-vercel-${Date.now()}`,
                  text: 'Canlı Web Projesi Yayını: https://mustafaali2.vercel.app',
                  tag: 'Web Projesi',
                  isCompleted: true,
                });
              }
            }
          }
        }
        // Ensure items array exists on all weeks
        parsed.weeks.forEach((w: WeekPlan, idx: number) => {
          if (!w.items) {
            w.items = generateDefaultItems(idx + 1);
          }
        });
        saveProgramToStorage(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.error('Program yükleme hatası:', err);
  }

  const initial = createInitialProgramStore();
  saveProgramToStorage(initial);
  return initial;
}

export function saveProgramToStorage(store: ProgramStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...store,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (err) {
    console.error('LocalStorage kaydetme hatası:', err);
  }
}
