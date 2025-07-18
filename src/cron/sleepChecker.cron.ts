import cron from 'node-cron';
import { Client } from 'discord.js';
import { getMinutesDifference, isInTimeInterval } from '../utils/time.utils.js';
import { sleepStore } from '../store/sleep.store.js';
import isTodayEnabled from '../utils/isTodayEnabled.utils.js';

export function startSleepChecker(client: Client) {
  cron.schedule('0 * * * * *', async () => {
    const users = sleepStore.getUsers();

    for (const userId of Object.keys(users)) {
      const user = users[userId];

      const { startTime, endTime } = user.intervalUTC;

      if (!isTodayEnabled(user.days)) {
        continue;
      }

      const minutesToStart = getMinutesDifference(startTime);

      // Ищем пользователя во всех гильдиях
      const member = findMemberInAnyGuild(client, userId);

      if (minutesToStart === 0 && member?.voice.channel) {
        await disconnectWithAnnouncement(member);
      }

      if (isInTimeInterval(startTime, endTime) && member?.voice.channel) {
        await disconnectUser(member, userId);
      }
    }
  });
}

/**
 * Находит участника во всех гильдиях
 */
function findMemberInAnyGuild(client: Client, userId: string) {
  for (const guild of client.guilds.cache.values()) {
    const member = guild.members.cache.get(userId);
    if (member) {
      return member;
    }
  }
  return null;
}

/**
 * Кикает пользователя с голосового
 */
async function disconnectUser(member: any, userId: string) {
  try {
    await member.voice.disconnect();
    console.log(`Disconnected user ${userId} during sleep interval.`);
  } catch (e) {
    console.error(`Failed to disconnect user ${userId}:`, e);
  }
}

/**
 * Кикает пользователя и пишет в системный канал
 */
async function disconnectWithAnnouncement(member: any) {
  try {
    const textChannel = member.voice.channel?.guild.systemChannel;

    await member.voice.disconnect();

    const message = `${member.displayName} принудительно ушёл спать. 😴`;

    if (textChannel) {
      await textChannel.send(message);
    } else {
      console.log(`No system channel to send notification for ${member.displayName}`);
    }
  } catch (e) {
    console.error(`Failed to disconnect user ${member.id}:`, e);
  }
}
