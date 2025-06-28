import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { sleepStore } from '../store/sleep.store';

export const data = new SlashCommandBuilder().setName('nosleep').setDescription('Удалить режим сна');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (await sleepStore.setStatus(interaction.user.id, false)) {
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
