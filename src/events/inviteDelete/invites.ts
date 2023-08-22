import { Guild, Invite } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"
import GuildModel from "../../models/guild"

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, invite: Invite) {
    bot.invites.get(invite.guild!.id)!.delete(invite.code);
    GuildModel.findOne({ guildId: invite.guild!.id }).then(guild => {
      if (!guild) return new GuildModel({ guildId: invite.guild!.id, invites: [] }).save()

      guild.invites = guild?.invites.filter(i => i.code !== invite.code)
      guild.save()
    })
  }
}
