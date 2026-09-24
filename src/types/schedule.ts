export interface ProgramItem {
  id: string;
  text: string;
  isCompleted: boolean;
  tag?: string;
}

export interface WeekPlan {
  weekNumber: number;      // 1 - 30
  title: string;           // e.g. "1. Hafta"
  topic?: string;          // e.g. "Web Tasarımına Giriş & HTML/CSS"
  driveFolderUrl?: string; // Google Drive klasör bağlantısı
  driveTitle?: string;     // Klasör başlığı
  content?: string;        // Kullanıcının serbestçe yazacağı haftalık program ve ders notları
  items: ProgramItem[];    // Haftalık program maddeleri / yapılacaklar (saat yok, seans yok)
  // Backward compatibility
  sessions?: any[];
  days?: any[];
  notes?: string;
}

export interface ProgramStore {
  ownerName: string;
  programTitle: string;
  totalWeeks: number;
  weeks: WeekPlan[];
  lastUpdated: string;
}
