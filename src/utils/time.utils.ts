export function isInTimeInterval(start: string, end: string): boolean {
  const now = new Date();
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (startMinutes <= endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  } else {
    // интервал через полночь
    return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
  }
}

export function normalizeTime(input: string): string | null {
  const parts = input.split(':');
  if (parts.length !== 2) return null;

  const [h, m] = parts.map(Number);

  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23) return null;
  if (m < 0 || m > 59) return null;

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
  