import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import { registerCommands } from './commands/registerCommands.js';
import * as goSleep from './commands/gosleep.js';
import * as noSleep from './commands/nosleep.js';
import { startSleepChecker } from './cron/sleepChecker.cron.js';
import { loadSleepData } from './store/sleep.store.js';
import { isInTimeInterval } from './utils/time.utils.js';

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
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const sleepData = await loadSleepData();
  const user = sleepData[message.author.id];

  if (user && isInTimeInterval(user.startTime, user.endTime)) {
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
