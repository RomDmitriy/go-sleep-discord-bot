import { CacheType, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { SleepUser } from '../store/sleep.store';
import isTodayEnabled from './isTodayEnabled.utils';
import { getMinutesDifference, isInTimeInterval } from './time.utils';

export default async function isSleepNow(
  interaction: ChatInputCommandInteraction<CacheType>,
  userData: SleepUser,
): Promise<boolean> {
  if (isTodayEnabled(userData.days, userData.utcOffset)) {
    if (isInTimeInterval(userData.intervalUTC.startTime, userData.intervalUTC.endTime)) {
      await interaction.reply({
        content: '⛔ Нельзя отменить режим сна во время его действия.',
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    const minutesToStart = getMinutesDifference(userData.intervalUTC.startTime);
    if (minutesToStart <= 15) {
      await interaction.reply({
        content: '⛔ Нельзя отменить режим сна за 15 минут до его начала.',
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }
  }

  return false;
}
