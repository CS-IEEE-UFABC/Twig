import { Collection } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'
import GuildModel from '../../models/guild'

export default class Invites implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute (bot: Bot): Promise<void> {
    bot.client.guilds.cache.forEach(guild => {
      guild.invites.fetch().then((invites) => {
        bot.invites.set(
          guild.id,
          new Collection(invites.map((invite) => [invite.code, invite.uses as number])))

        GuildModel.findOne({ guild_id: guild.id }).then((guildDB) => {
          if (guildDB == null) {
            guildDB = new GuildModel({
              guild_id: guild.id
            })
          };
          guildDB.invites = guildDB.invites
            .filter((invite) => bot.invites.get(guild.id)?.has(invite.code as string))
          guildDB.save().catch((err) => { bot.logger.error((err as Error).stack) })
        }).catch((err) => { bot.logger.error((err as Error).stack) })
      }).catch((err) => { bot.logger.error((err as Error).stack) })
    })
  }
}
