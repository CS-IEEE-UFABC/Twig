import { type GuildMember, type Role } from 'discord.js'
import type Bot from '../bot'
import Guild from '../models/guild'

export default function addRolesIfNeeded (bot: Bot, members: GuildMember[]): void {
  members = members.filter((member) => !member.user.bot)
  Guild.findOne({ guild_id: members[0].guild.id }).then((guild) => {
    if (guild?.settings?.roles == null) return

    const roles = guild.settings.roles.map((role) => {
      return /mandatoryRole\((\d+)\)/.exec(role)
    }).filter((role) => role !== null).map((role) => role?.[1]) as string[]

    const autoRole = (roles
      .map((role: string) => members[0].guild.roles.cache.get(role)) as Role[])
      .filter((role: Role) => role !== undefined)

    members.forEach((member) => {
      const newRoles = autoRole
        .filter((role: Role) => !member.roles.cache.has(role.id))
      if (newRoles.length === 0) return

      member.roles.add(newRoles)
        .catch((e) => bot.logger.error({
          message: (e as Error).stack,
          scope: 'Utils/Roles#addRolesIfNeeded'
        }))

      bot.logger.verbose(`Adding roles [${newRoles.map((role) => role.name).join(', ')}] to ${member.user.username}`)
    })
  }).catch((e) => bot.logger.error({
    message: (e as Error).stack,
    scope: 'Utils/Roles#addRolesIfNeeded'
  }))
}
