import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import { registerCommands } from './commands/registerCommands.js';
import * as goSleep from './commands/gosleep.js';
import * as noSleep from './commands/nosleep.js';
import * as setdays from './commands/setdays.js';
import { startSleepChecker } from './cron/sleepChecker.cron.js';
import { isInTimeInterval } from './utils/time.utils.js';
import { sleepStore } from './store/sleep.store.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
  startSleepChecker(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'gosleep') {
    await goSleep.execute(interaction);
  } else if (interaction.commandName === 'nosleep') {
    await noSleep.execute(interaction);
  } else if (interaction.commandName === 'setdays') {
    await setdays.execute(interaction);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const user = sleepStore.getUser(message.author.id);

  if (user && user.isEnabled && isInTimeInterval(user.intervalUTC.startTime, user.intervalUTC.endTime)) {
    try {
      await message.delete();
      console.log(`Deleted message from ${message.author.id} during sleep.`);
    } catch (e) {
      console.error(e);
    }
  }
});

(async () => {
  await registerCommands();
  await client.login(process.env.DISCORD_TOKEN);
})();
