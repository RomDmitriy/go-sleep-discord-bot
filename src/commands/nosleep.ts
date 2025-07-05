import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { sleepStore } from '../store/sleep.store';
import { getMinutesDifference, isInTimeInterval } from '../utils/time.utils';

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

  const { startTime, endTime } = userSleep.intervalUTC;

  if (isInTimeInterval(startTime, endTime)) {
    await interaction.reply({
      content: '⛔ Нельзя отменить режим сна во время его действия.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const minutesToStart = getMinutesDifference(startTime);
  if (minutesToStart <= 15) {
    await interaction.reply({
      content: '⛔ Нельзя отменить режим сна за 15 минут до его начала.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await sleepStore.deleteUser(interaction.user.id);

  await interaction.reply({
    content: 'Твой режим сна удалён.',
    flags: MessageFlags.Ephemeral,
  });
}
