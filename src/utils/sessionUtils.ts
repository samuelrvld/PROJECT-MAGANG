import type { Booking } from '../types';

export interface SessionConfig {
  id: string; // e.g. "Sesi I"
  label: string; // e.g. "Sesi I"
  time: string; // e.g. "07:30 - 10:00 WIB"
  subLabel: string; // "Pagi", "Siang", "Sore"
  startHour: number; // 7
  startMinute: number; // 30
  endHour: number; // 10
  endMinute: number; // 0
  maxQuota: number; // 100
}

export interface IshomaConfig {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  label: string; // "12:30 – 13:30 WIB"
  time: string; // "12:30 - 13:30"
}

export const DEFAULT_ISHOMA_CONFIG: IshomaConfig = {
  startHour: 12,
  startMinute: 30,
  endHour: 13,
  endMinute: 30,
  label: '12:30 – 13:30 WIB',
  time: '12:30 - 13:30'
};

export const SESSIONS_CONFIG: SessionConfig[] = [
  {
    id: 'Sesi I',
    label: 'Sesi I',
    time: '07:30 - 10:00 WIB',
    subLabel: 'Pagi',
    startHour: 7,
    startMinute: 30,
    endHour: 10,
    endMinute: 0,
    maxQuota: 100
  },
  {
    id: 'Sesi II',
    label: 'Sesi II',
    time: '10:00 - 12:30 WIB',
    subLabel: 'Siang',
    startHour: 10,
    startMinute: 0,
    endHour: 12,
    endMinute: 30,
    maxQuota: 100
  },
  {
    id: 'Sesi III',
    label: 'Sesi III',
    time: '13:30 - 16:00 WIB',
    subLabel: 'Sore',
    startHour: 13,
    startMinute: 30,
    endHour: 16,
    endMinute: 0,
    maxQuota: 100
  },
];

const SESSIONS_STORAGE_KEY = 'mb_sessions_config';
const ISHOMA_STORAGE_KEY = 'mb_ishoma_config';

export const getStoredSessionsConfig = (): SessionConfig[] => {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return SESSIONS_CONFIG;
};

export const saveStoredSessionsConfig = (configs: SessionConfig[]): void => {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(configs));
  } catch (_) {}
};

export const getStoredIshomaConfig = (): IshomaConfig => {
  try {
    const raw = localStorage.getItem(ISHOMA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return DEFAULT_ISHOMA_CONFIG;
};

export const saveStoredIshomaConfig = (config: IshomaConfig): void => {
  try {
    localStorage.setItem(ISHOMA_STORAGE_KEY, JSON.stringify(config));
  } catch (_) {}
};

export const resetStoredScheduleConfig = (): void => {
  try {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
    localStorage.removeItem(ISHOMA_STORAGE_KEY);
  } catch (_) {}
};

// Returns next open weekday (Monday-Friday) YYYY-MM-DD
export const getNextWeekdayDateStr = (): string => {
  const d = new Date();
  const day = d.getDay(); // 0 = Sun, 6 = Sat
  if (day === 6) {
    // Saturday -> next Monday
    d.setDate(d.getDate() + 2);
  } else if (day === 0) {
    // Sunday -> tomorrow Monday
    d.setDate(d.getDate() + 1);
  }
  return d.toISOString().split('T')[0];
};

// Normalize date string to YYYY-MM-DD
export const normalizeDateStr = (dateStr: string): string => {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const monthsIndo: Record<string, string> = {
    januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
    juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
  };

  const parts = trimmed.toLowerCase().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = monthsIndo[parts[1]];
    const year = parts[2];
    if (month && year) {
      return `${year}-${month}-${day}`;
    }
  }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (_) {}

  return trimmed;
};

// Check if selected date is Saturday or Sunday (Museum is open Monday - Friday 07:30 - 16:00 WIB)
export const isWeekendClosed = (targetDateStr: string): boolean => {
  if (!targetDateStr) return false;
  const normalized = normalizeDateStr(targetDateStr);
  try {
    const [y, m, d] = normalized.split('-').map(Number);
    if (!y || !m || !d) return false;
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  } catch (_) {
    return false;
  }
};

// Legacy compatibility
export const isDateMonday = (_targetDateStr: string): boolean => false;

// Get current date string in WIB (Asia/Jakarta) formatted as YYYY-MM-DD
export const getTodayWIB = (): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  } catch (_) {
    return new Date().toISOString().split('T')[0];
  }
};

// Check if a session has passed for a given date
export const isSessionTimePassed = (session: SessionConfig, targetDateStr: string): boolean => {
  if (!targetDateStr) return false;
  
  const todayWIB = getTodayWIB();
  const normalizedTarget = normalizeDateStr(targetDateStr);
  
  // If target date is in the past
  if (normalizedTarget < todayWIB) return true;
  // If target date is in the future (tomorrow, etc.), session is not passed
  if (normalizedTarget > todayWIB) return false;

  // Target date is TODAY: check current time in WIB
  try {
    const timeStr = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
    
    const [currH, currM] = timeStr.split(':').map(Number);
    const currTotalMinutes = currH * 60 + currM;
    const sessionEndTotalMinutes = session.endHour * 60 + session.endMinute;
    
    // Once current time reaches session end time, session has passed
    return currTotalMinutes >= sessionEndTotalMinutes;
  } catch (_) {
    const now = new Date();
    const currTotalMinutes = now.getHours() * 60 + now.getMinutes();
    return currTotalMinutes >= (session.endHour * 60 + session.endMinute);
  }
};

// Extract canonical session ID ('Sesi I' | 'Sesi II' | 'Sesi III') from any string safely
export const extractSessionId = (sesiStr: string): 'Sesi I' | 'Sesi II' | 'Sesi III' | '' => {
  if (!sesiStr) return '';
  const trimmed = sesiStr.trim();
  // Check 'Sesi III' first because it contains 'Sesi II' and 'Sesi I' as substrings
  if (/(?:^|\b|\()Sesi\s*III(?:\b|\)|$)/i.test(trimmed) || trimmed.toLowerCase().includes('sesi iii')) {
    return 'Sesi III';
  }
  // Check 'Sesi II' next because it contains 'Sesi I' as a substring
  if (/(?:^|\b|\()Sesi\s*II(?:\b|\)|$)/i.test(trimmed) || trimmed.toLowerCase().includes('sesi ii')) {
    return 'Sesi II';
  }
  // Check 'Sesi I' last
  if (/(?:^|\b|\()Sesi\s*I(?:\b|\)|$)/i.test(trimmed) || trimmed.toLowerCase().includes('sesi i')) {
    return 'Sesi I';
  }
  return '';
};

// Get session quota stats (Max 100 per session)
export const getSessionQuotaStats = (
  sessionIdOrLabel: string,
  targetDateStr: string,
  bookings: Booking[]
) => {
  const targetId = extractSessionId(sessionIdOrLabel);
  const max = 100;
  if (!targetDateStr) {
    return { booked: 0, remaining: max, max, isFull: false };
  }

  const normalizedTarget = normalizeDateStr(targetDateStr);

  const booked = bookings
    .filter(b => {
      if (b.status === 'Ditolak') return false;
      const bDateNorm = normalizeDateStr(b.tanggalKunjungan);
      const matchesDate = bDateNorm === normalizedTarget || b.tanggalKunjungan === targetDateStr;
      const bSessionId = extractSessionId(b.sesi);
      const matchesSession = targetId ? bSessionId === targetId : b.sesi.toLowerCase().includes(sessionIdOrLabel.toLowerCase());
      return matchesDate && matchesSession;
    })
    .reduce((sum, b) => sum + (Number(b.jumlahOrang) || 1), 0);

  const remaining = Math.max(0, max - booked);
  return {
    booked,
    remaining,
    max,
    isFull: remaining <= 0
  };
};
