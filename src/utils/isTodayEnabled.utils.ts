import { IDays } from '../store/sleep.store';

type WeekdayType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export default function isTodayEnabled(days: IDays): boolean {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as WeekdayType;

  return days[today];
}
