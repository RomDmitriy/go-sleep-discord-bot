import cron from 'node-cron';
import { Client } from 'discord.js';
import { loadSleepData } from '../store/sleep.store.js';
import { isInTimeInterval } from '../utils/time.utils.js';

export function startSleepChecker(client: Client) {
  cron.schedule('*/5 * * * * *', async () => {
    const sleepData = await loadSleepData();

    for (const userId of Object.keys(sleepData)) {
      const { startTime, endTime } = sleepData[userId];

      if (isInTimeInterval(startTime, endTime)) {
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
