import { IDays } from '../store/sleep.store';

type WeekdayType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export default function isTodayEnabled(days: IDays, utcOffset: number): boolean {
  const utcTime = new Date().getTime() + 4 * 60 * 60 * 1000;
  const adjustedDate = new Date(utcTime);

  const weekday = adjustedDate
    .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
    .toLowerCase() as WeekdayType;

  return days[weekday];
}
