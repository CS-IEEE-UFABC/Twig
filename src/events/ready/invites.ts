import { Collection } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"
import GuildModel from "../../models/guild"

export default class Invites implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute(bot: Bot) {
    bot.client.guilds.cache.forEach(async guild => {
      guild.invites.fetch().then((invites) => {

        bot.invites.set(
          guild.id,
          new Collection(invites.map((invite) => [invite.code, invite.uses!])))

        GuildModel.findOne({ guild_id: guild.id }).then((guild_db) => {
          if (!guild_db) {
            guild_db = new GuildModel({
              guild_id: guild.id
            })
          };
          guild_db.invites = guild_db.invites
            .filter((invite) => bot.invites.get(guild.id)!.has(invite.code!));
          guild_db.save();
        })
      })
    })
  }
}
