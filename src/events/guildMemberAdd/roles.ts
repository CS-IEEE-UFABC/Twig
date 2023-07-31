import { GuildMember, Role } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"
import addRolesIfNeeded from "../../utils/roles"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute(bot: Bot, member: GuildMember) {
    addRolesIfNeeded(bot, [member])
  }
}