import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";

export default class {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra as informações da estabilidade do Twig')

  async execute(bot: Bot, interaction: ChatInputCommandInteraction) {
    interaction.reply({ content: '🏓 Pinging...', ephemeral: false, fetchReply: true })
      .then(sent => {
        interaction.editReply(`🏓 Latência ida e volta: ${sent.createdTimestamp - interaction.createdTimestamp}ms.\nLatência API: ${bot.client.ws.ping}ms.`);
      })
  };
};
