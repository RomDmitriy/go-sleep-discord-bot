import { Client } from 'discord.js';
import cron from 'node-cron';
import { sleepStore } from '../store/sleep.store';
import { getMinutesDifference } from '../utils/time.utils';

export function startSleepChecker(client: Client) {
  cron.schedule('0 * * * *', async () => {
    const sleepData = sleepStore.getUsers();

    for (const userId of Object.keys(sleepData)) {
      const { startTime } = sleepData[userId].intervalUTC;

      // проверка за 15 минут до начала
      const minutesToStart = getMinutesDifference(startTime);

      if (minutesToStart === 15) {
        for (const guild of client.guilds.cache.values()) {
          const member = guild.members.cache.get(userId);
          if (member?.voice.channel) {
            try {
              await member.send(`⚠️ Через 15 минут начинается твой режим сна!`);
              console.log(`Sent sleep warning to ${userId}`);
            } catch (e) {
              console.error(`Failed to send DM to ${userId}:`, e);
            }
          }
        }
      }
    }
  });
}
