const STORAGE_KEY = 'scanron_time_offset';
const EVENT_NAME = 'scanron_time_offset_changed';

/**
 * Returns the current time offset in milliseconds.
 */
export function getTimeOffset(): number {
  if (typeof localStorage === 'undefined') return 0;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return 0;
  const parsed = parseInt(saved, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Saves the time offset and dispatches a change event.
 */
export function setTimeOffset(offset: number): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, offset.toString());
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: offset }));
  }
}

/**
 * Returns the timestamp adjusted by the synced offset.
 */
export function getEffectiveTime(): number {
  return Date.now() + getTimeOffset();
}

/**
 * Subscribes to time offset change events.
 */
export function subscribeToTimeOffset(callback: (offset: number) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<number>;
    callback(customEvent.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}

/**
 * Synchronizes the local clock with a public server to calculate drift.
 */
export async function syncTimeWithServer(): Promise<number> {
  const start = Date.now();
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    const end = Date.now();
    const latency = (end - start) / 2;
    
    if (!data.utc_datetime) throw new Error('Missing utc_datetime');
    const serverTime = new Date(data.utc_datetime).getTime() + latency;
    const offset = serverTime - end;
    setTimeOffset(offset);
    return offset;
  } catch (primaryError) {
    const startFallback = Date.now();
    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
    if (!response.ok) {
      throw new Error(`Fallback HTTP error ${response.status}`, { cause: primaryError });
    }
    const data = await response.json();
    const endFallback = Date.now();
    const latency = (endFallback - startFallback) / 2;

    if (!data.dateTime) throw new Error('Missing dateTime', { cause: primaryError });
    const serverTime = new Date(data.dateTime + 'Z').getTime() + latency;
    const offset = serverTime - endFallback;
    setTimeOffset(offset);
    return offset;
  }
}
