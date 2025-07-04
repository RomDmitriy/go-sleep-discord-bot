import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { sleepStore } from '../store/sleep.store.js';

export const data = new SlashCommandBuilder()
  .setName('setdays')
  .setDescription('Установить в какие дни блокировка работает. Изначально стоит, что работает во все дни')
  .addBooleanOption((option) => option.setName('monday').setDescription('Понедельник'))
  .addBooleanOption((option) => option.setName('tuesday').setDescription('Вторник'))
  .addBooleanOption((option) => option.setName('wednesday').setDescription('Среда'))
  .addBooleanOption((option) => option.setName('thursday').setDescription('Четверг'))
  .addBooleanOption((option) => option.setName('friday').setDescription('Пятница'))
  .addBooleanOption((option) => option.setName('saturday').setDescription('Суббота'))
  .addBooleanOption((option) => option.setName('sunday').setDescription('Воскресенье'));

export async function execute(interaction: ChatInputCommandInteraction) {
  const monday = interaction.options.getBoolean('monday') ?? true;
  const tuesday = interaction.options.getBoolean('tuesday') ?? true;
  const wednesday = interaction.options.getBoolean('wednesday') ?? true;
  const thursday = interaction.options.getBoolean('thursday') ?? true;
  const friday = interaction.options.getBoolean('friday') ?? true;
  const saturday = interaction.options.getBoolean('saturday') ?? true;
  const sunday = interaction.options.getBoolean('sunday') ?? true;

  if (
    await sleepStore.setDays(interaction.user.id, { monday, tuesday, wednesday, thursday, friday, saturday, sunday })
  ) {
    await interaction.reply({
      content: `✅ Дни недели установлены`,
      flags: MessageFlags.Ephemeral,
    });
  } else {
    await interaction.reply({
      content: `Вы не указали интервал, выполните команду /gosleep`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
