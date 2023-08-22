import { Collection, Guild, Invite } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, guild: Guild) {
    guild.invites.fetch().then(invites => {
      bot.invites.set(
        guild.id,
        new Collection(invites.map((invite) => [invite.code, invite.uses!])));
    })
  }
}
