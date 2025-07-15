import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { getMinutesDifference, isInTimeInterval, normalizeTime } from '../utils/time.utils.js';
import { sleepStore } from '../store/sleep.store.js';

export const data = new SlashCommandBuilder()
  .setName('gosleep')
  .setDescription('Установить режим сна')
  .addStringOption((option) => option.setName('start_time').setDescription('Начало сна (HH:mm)').setRequired(true))
  .addStringOption((option) => option.setName('end_time').setDescription('Конец сна (HH:mm)').setRequired(true))
  .addNumberOption((option) =>
    option
      .setName('utc_offset')
      .setDescription('Смещение от UTC. Если не указано, значит UTC+3')
      .setMinValue(-12)
      .setMaxValue(14),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const userSleep = sleepStore.getUser(interaction.user.id);

  if (userSleep) {
    const { startTime, endTime } = userSleep.intervalUTC;

    if (isInTimeInterval(startTime, endTime)) {
      await interaction.reply({
        content: '⛔ Нельзя изменить режим сна во время его действия.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const minutesToStart = getMinutesDifference(startTime);
    if (minutesToStart <= 15) {
      await interaction.reply({
        content: '⛔ Нельзя изменить режим сна за 15 минут до его начала.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  }

  let startTime: string | null = interaction.options.getString('start_time') ?? '';
  let endTime: string | null = interaction.options.getString('end_time') ?? '';
  let utcOffset: number = interaction.options.getNumber('utc_offset') ?? 3;

  startTime = normalizeTime(startTime) ?? null;
  endTime = normalizeTime(endTime) ?? null;

  if (!startTime || !endTime) {
    await interaction.reply({
      content: '⛔ Время должно быть в формате HH:mm (например, 06:30).',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await sleepStore.setInterval(interaction.user.id, startTime, endTime, utcOffset);

  await interaction.reply({
    content: `✅ Режим сна установлен: **${startTime} — ${endTime} UTC+${utcOffset}**`,
    flags: MessageFlags.Ephemeral,
  });
}
