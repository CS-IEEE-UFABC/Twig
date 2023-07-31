import { GuildMember, Role } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"
import addRolesIfNeeded from "../../utils/roles"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, oldMember: GuildMember, newMember: GuildMember) {
    addRolesIfNeeded(bot, [newMember])
  }
}
