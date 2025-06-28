export function isInTimeInterval(start: string, end: string): boolean {
  const now = new Date();
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  if (startMinutes <= endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  } else {
    // интервал через полночь
    return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
  }
}

export function normalizeTime(input: string): string | null {
  // Проверяем, что строка состоит только из цифр и :
  if (!/^\d{1,2}:\d{1,2}$/.test(input)) return null;

  const parts = input.split(':');
  if (parts.length !== 2) return null;

  const [hStr, mStr] = parts;
  const h = Number(hStr);
  const m = Number(mStr);

  // Проверяем целые ли это числа
  if (!Number.isInteger(h) || !Number.isInteger(m)) return null;

  if (h < 0 || h > 23) return null;
  if (m < 0 || m > 59) return null;

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Преобразует локальное время пользователя в UTC-строку HH:mm
 * @param localTime строка в формате HH:mm
 * @param offsetHours число, смещение пользователя от UTC (например +3)
 * @returns строка в формате HH:mm
 */
export function adjustTimeToUTC(localTime: string, offsetHours: number): string {
  const [h, m] = localTime.split(':').map(Number);

  const localDate = new Date();
  localDate.setUTCHours(h);
  localDate.setUTCMinutes(m);
  localDate.setUTCSeconds(0);
  localDate.setUTCMilliseconds(0);

  // смещаем в обратную сторону → чтобы получить UTC-время
  localDate.setUTCHours(localDate.getUTCHours() - offsetHours);

  const resultH = localDate.getUTCHours();
  const resultM = localDate.getUTCMinutes();

  return `${resultH.toString().padStart(2, '0')}:${resultM.toString().padStart(2, '0')}`;
}
