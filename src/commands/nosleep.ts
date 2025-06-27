import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { loadSleepData, saveSleepData } from '../store/sleep.store.js';

export const data = new SlashCommandBuilder().setName('nosleep').setDescription('Удалить режим сна');

export async function execute(interaction: ChatInputCommandInteraction) {
  const sleepData = await loadSleepData();

  if (sleepData[interaction.user.id]) {
    delete sleepData[interaction.user.id];
    await saveSleepData(sleepData);
    await interaction.reply({
      content: 'Твой режим сна удалён.',
      flags: MessageFlags.Ephemeral,
    });
  } else {
    await interaction.reply({
      content: 'У тебя не установлен режим сна.',
      flags: MessageFlags.Ephemeral,
    });
  }
}
