import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { data as goSleepData } from './gosleep.js';
import { data as noSleepData } from './nosleep.js';
import { data as setDaysData } from './setdays.js';

export async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
    body: [goSleepData.toJSON(), noSleepData.toJSON(), setDaysData.toJSON()],
  });

  console.log('✅ Slash-команды зарегистрированы глобально.');
}
