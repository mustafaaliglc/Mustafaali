import { ProgramStore, WeekPlan, ProgramItem } from '../types/schedule';

export const WEEK_1_DRIVE_URL = 'https://drive.google.com/drive/folders/1IPqE7_sRv7mMc5hRAhJifFiC42VtB-K1?hl=tr';

export const DEFAULT_TAGS = [
  'HTML & CSS',
  'JavaScript',
  'UI / UX & Figma',
  'Web Projesi',
  'Responsive Tasarım',
  'Genel',
];

export function generateDefaultItems(weekNumber: number): ProgramItem[] {
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
  return {
    weekNumber,
    title: `${weekNumber}. Hafta`,
    topic: isWeek1 ? 'Web Tasarımına Giriş & HTML/CSS' : '',
    driveFolderUrl: isWeek1 ? WEEK_1_DRIVE_URL : '',
    driveTitle: isWeek1 ? '1. Hafta Web Tasarımı Drive Klasörü' : '',
    content: '',
    items: generateDefaultItems(weekNumber),
  };
}

export function createInitialProgramStore(): ProgramStore {
  const weeks: WeekPlan[] = [];
  for (let i = 1; i <= 30; i++) {
    weeks.push(generateEmptyWeek(i));
  }

  return {
    ownerName: 'Mustafa Ali Güleç',
    programTitle: '30 Haftalık Web Tasarımı Programı',
    totalWeeks: 30,
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
      if (parsed && Array.isArray(parsed.weeks) && parsed.weeks.length === 30) {
        if (!parsed.weeks[0].driveFolderUrl) {
          parsed.weeks[0].driveFolderUrl = WEEK_1_DRIVE_URL;
          parsed.weeks[0].driveTitle = '1. Hafta Web Tasarımı Drive Klasörü';
        }
        // Ensure items array exists on all weeks
        parsed.weeks.forEach((w: WeekPlan, idx: number) => {
          if (!w.items) {
            w.items = generateDefaultItems(idx + 1);
          }
        });
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
