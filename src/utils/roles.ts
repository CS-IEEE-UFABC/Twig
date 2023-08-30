import { type GuildMember, type Role } from 'discord.js'
import type Bot from '../bot'
import Guild from '../models/guild'

export default function addRolesIfNeeded (bot: Bot, members: GuildMember[]): void {
  members = members.filter((member) => !member.user.bot)
  Guild.findOne({ guild_id: members[0].guild.id }).then((doc) => {
    if (doc?.settings?.auto_role == null) return
    const autoRole = (doc.settings.auto_role
      .map((role: string) => members[0].guild.roles.cache.get(role)) as Role[])
      .filter((role: Role) => role !== undefined)

    members.forEach((member) => {
      const newRoles = autoRole
        .filter((role: Role) => !member.roles.cache.has(role.id))
      if (newRoles.length > 0) {
        member.roles.add(newRoles)
          .catch((err) => { bot.logger.error((err as Error).stack) })

        bot.logger.verbose(`Adding roles [${newRoles.map((role) => role.name).join(', ')}] to ${member.user.username}`)
      }
    })
  }).catch((err) => { bot.logger.error((err as Error).stack) })
}
