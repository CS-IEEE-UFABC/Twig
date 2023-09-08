import { type Guild } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, guild: Guild): Promise<void> {
    guild.invites.delete(guild.id)
      .catch((e) => bot.logger.error({
        message: (e as Error).stack,
        scope: 'GuildDelete/Invites#execute'
      }))
  }
}
