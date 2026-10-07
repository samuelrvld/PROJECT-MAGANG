import type { Booking, AdminUser } from '../types';

export type SyncEventType = 
  | 'NEW_BOOKING'
  | 'VERIFY_BOOKING'
  | 'REJECT_BOOKING'
  | 'CHECKIN_BOOKING'
  | 'UPDATE_ADMINS'
  | 'SYNC_PING';

export interface SyncEventPayload {
  type: SyncEventType;
  senderId: string;
  timestamp: number;
  booking?: Booking;
  bookingId?: string;
  reason?: string;
  checkInTime?: string;
  admins?: AdminUser[];
}

// Topic publik unik untuk sinkronisasi Museum Blambangan antar perangkat (HP <-> Laptop)
export const SYNC_TOPIC = 'mb-blambangan-banyuwangi-sync-v1';
export const SYNC_URL = `https://ntfy.sh/${SYNC_TOPIC}`;

// Persistent Device ID per perangkat/browser
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem('mb_device_sync_id');
  if (!id) {
    id = `dev-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
    try {
      localStorage.setItem('mb_device_sync_id', id);
    } catch (_) {}
  }
  return id;
};

// Mengirim event ke cloud broadcast agar diterima perangkat lain secara instan
export const broadcastSyncEvent = async (
  event: Omit<SyncEventPayload, 'senderId' | 'timestamp'>
): Promise<boolean> => {
  try {
    const payload: SyncEventPayload = {
      ...event,
      senderId: getDeviceId(),
      timestamp: Date.now(),
    };

    const res = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    // Mode offline tetap aman
    return false;
  }
};

// Berlangganan (listen) perubahan real-time dari perangkat lain via Server-Sent Events (SSE)
export const subscribeSyncEvents = (
  onEvent: (payload: SyncEventPayload) => void,
  onStatusChange?: (connected: boolean) => void
): (() => void) => {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
    return () => {};
  }

  let eventSource: EventSource | null = null;
  let isClosed = false;

  const connect = () => {
    if (isClosed) return;
    try {
      eventSource = new EventSource(`${SYNC_URL}/sse`);

      eventSource.onopen = () => {
        onStatusChange?.(true);
      };

      eventSource.onmessage = (e) => {
        try {
          const raw = JSON.parse(e.data);
          if (raw && raw.message) {
            const parsed: SyncEventPayload = JSON.parse(raw.message);
            // Hanya tangani event dari perangkat lain (bukan dari diri sendiri)
            if (parsed && parsed.senderId && parsed.senderId !== getDeviceId()) {
              onEvent(parsed);
            }
          }
        } catch (_) {
          // Keepalive atau format bukan JSON diabaikan
        }
      };

      eventSource.onerror = () => {
        onStatusChange?.(false);
      };
    } catch (_) {
      onStatusChange?.(false);
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
};
