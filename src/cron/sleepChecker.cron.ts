import cron from 'node-cron';
import { Client } from 'discord.js';
import { isInTimeInterval } from '../utils/time.utils.js';
import { sleepStore } from '../store/sleep.store.js';

type weekdayType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export function startSleepChecker(client: Client) {
  cron.schedule('*/5 * * * * *', async () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const users = sleepStore.getUsers();
    for (const userId of Object.keys(users)) {
      const { startTime, endTime } = users[userId].intervalUTC;
      const days = users[userId].days;

      if ((days[today as weekdayType] || false) && isInTimeInterval(startTime, endTime)) {
        // Найти пользователя во всех серверах
        for (const guild of client.guilds.cache.values()) {
          const member = guild.members.cache.get(userId);
          if (member?.voice.channel) {
            try {
              await member.voice.disconnect();
              console.log(`Disconnected user ${userId} during sleep interval.`);
            } catch (e) {
              console.error(`Failed to disconnect user ${userId}:`, e);
            }
          }
        }
      }
    }
  });
}
