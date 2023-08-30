import { SlashCommandBuilder, type ChatInputCommandInteraction, type ShardClientUtil } from 'discord.js'
import type Bot from '../../bot'

export default class {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra as informações da estabilidade do Twig')

  async execute (bot: Bot, interaction: ChatInputCommandInteraction): Promise<void> {
    const gateway = bot.client.ws.ping

    /*
      🏓 | Pong!
      📡 | Shard 1/2
      ⏱️ | Gateway Ping: `150ms`
      ⚡ | API Ping: `...ms`
    */
    interaction.reply({
      content: '🏓 | Pong!\n' +
        `📡 | Shard ${(bot.client.shard as ShardClientUtil).ids[0] + 1}/${(bot.client.shard as ShardClientUtil).count}\n` +
        `⏱️ | Gateway Ping: \`${gateway}ms\`\n` +
        '⚡ | API Ping: `...ms`',
      ephemeral: false,
      fetchReply: true
    }).then(sent => {
      /*
        🏓 | Pong!
        📡 | Shard 1/2
        ⏱️ | Gateway Ping: `150ms`
        ⚡ | API Ping: `417ms`
      */
      interaction.editReply('🏓 | Pong!\n' +
        `📡 | Shard ${(bot.client.shard as ShardClientUtil).ids[0] + 1}/${(bot.client.shard as ShardClientUtil).count}\n` +
        `⏱️ | Gateway Ping: \`${gateway}ms\`\n` +
        `⚡ | API Ping: \`${sent.createdTimestamp - interaction.createdTimestamp}ms\``
      ).catch((err) => { bot.logger.error((err as Error).stack) })
    }).catch((err) => { bot.logger.error((err as Error).stack) })
  };
};
