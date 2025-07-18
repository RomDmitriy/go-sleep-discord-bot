import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { sleepStore } from '../store/sleep.store';
import { getMinutesDifference, isInTimeInterval } from '../utils/time.utils';
import isTodayEnabled from '../utils/isTodayEnabled.utils';
import isSleepNow from '../utils/isSleepNow.utils';

export const data = new SlashCommandBuilder().setName('nosleep').setDescription('Удалить режим сна');

export async function execute(interaction: ChatInputCommandInteraction) {
  const userSleep = sleepStore.getUser(interaction.user.id);

  if (!userSleep) {
    await interaction.reply({
      content: 'У тебя не установлен режим сна.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (await isSleepNow(interaction, userSleep)) return;

  await sleepStore.deleteUser(interaction.user.id);

  await interaction.reply({
    content: 'Твой режим сна удалён.',
    flags: MessageFlags.Ephemeral,
  });
}
