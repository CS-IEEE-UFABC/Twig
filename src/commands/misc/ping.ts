import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";

export default class {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra as informações da estabilidade do Twig')

  async execute(bot: Bot, interaction: ChatInputCommandInteraction) {
    let gateway = bot.client.ws.ping

    /* 
      🏓 | Pong!
      📡 | Shard 1/2
      ⏱️ | Gateway Ping: `150ms`
      ⚡ | API Ping: `...ms`
    */
    interaction.reply({
      content: `🏓 | Pong!\n` +
        `📡 | Shard ${bot.client.shard!.ids[0]! + 1}/${bot.client.shard!.count}\n` +
        `⏱️ | Gateway Ping: \`${gateway}ms\`\n` +
        `⚡ | API Ping: \`...ms\``,
      ephemeral: false, fetchReply: true
    })
      .then(sent => {
        /* 
          🏓 | Pong!
          📡 | Shard 1/2
          ⏱️ | Gateway Ping: `150ms`
          ⚡ | API Ping: `417ms`
        */
        interaction.editReply(`🏓 | Pong!\n` +
          `📡 | Shard ${bot.client.shard!.ids[0]! + 1}/${bot.client.shard!.count}\n` +
          `⏱️ | Gateway Ping: \`${gateway}ms\`\n` +
          `⚡ | API Ping: \`${sent.createdTimestamp - interaction.createdTimestamp}ms\``)
      })
  };
};
