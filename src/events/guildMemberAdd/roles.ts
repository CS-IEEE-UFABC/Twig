import { type GuildMember } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'
import addRolesIfNeeded from '../../utils/roles'

export default class Roles implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, member: GuildMember): Promise<void> {
    addRolesIfNeeded(bot, [member])
  }
}
