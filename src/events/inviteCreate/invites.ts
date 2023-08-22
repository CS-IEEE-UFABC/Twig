import { Invite } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"
import GuildModel from "../../models/guild"

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, invite: Invite) {
    bot.invites.get(invite.guild!.id)!.set(invite.code, invite.uses!);
  }
}
