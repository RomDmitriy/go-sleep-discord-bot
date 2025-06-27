import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { saveSleepData } from '../store/sleep.store.js';
import { normalizeTime } from '../utils/time.utils.js';

export const data = new SlashCommandBuilder()
  .setName('gosleep')
  .setDescription('Установить режим сна')
  .addStringOption((option) => option.setName('start_time').setDescription('Начало сна (HH:mm)').setRequired(true))
  .addStringOption((option) => option.setName('end_time').setDescription('Конец сна (HH:mm)').setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  let startTime: string | null = interaction.options.getString('start_time')!;
  let endTime: string | null = interaction.options.getString('end_time')!;

  startTime = normalizeTime(startTime) ?? null;
  endTime = normalizeTime(endTime) ?? null;

  if (!startTime || !endTime) {
    await interaction.reply({
      content: '⛔ Время должно быть в формате HH:mm (например, 06:30).',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await saveSleepData({ [interaction.user.id]: { startTime, endTime } });

  await interaction.reply({
    content: `✅ Режим сна установлен: **${startTime} — ${endTime}**`,
    flags: MessageFlags.Ephemeral,
  });
}
