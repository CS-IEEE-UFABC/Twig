import { Collection, type Guild } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, guild: Guild): Promise<void> {
    guild.invites.fetch().then(invites => {
      bot.invites.set(
        guild.id,
        new Collection(invites.map((invite) => [invite.code, invite.uses as number])))
    }).catch((e) => bot.logger.error({
      message: (e as Error).stack,
      scope: 'GuildCreate/Invites#execute'
    }))
  }
}
