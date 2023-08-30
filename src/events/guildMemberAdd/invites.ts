import { type GuildMember } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'
import VolunteerModel from '../../models/volunteer'
import GuildModel from '../../models/guild'

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, member: GuildMember): Promise<void> {
    member.guild.invites.fetch().then((newInvites) => {
      const oldInvites = bot.invites.get(member.guild.id)
      if (oldInvites === undefined) return

      const invite = newInvites
        .find(i =>
          i.uses !== null &&
          oldInvites.get(i.code) !== null &&
          i.uses > (oldInvites.get(i.code) as number))

      if (invite == null) return

      GuildModel.findOne({ guild_id: member.guild.id }).then(guild => {
        if (guild?.invites == null) return

        const inviteDB = guild.invites.find((i) => i.code === invite.code)
        if (inviteDB == null) return

        VolunteerModel.findOne({ ra: inviteDB.ra }).then(volunteer => {
          if (volunteer?.nome == null) return
          const names = volunteer.nome.split(' ')
          const nickname = `${names.shift()} ` +
            `${names
              .map((name) => name.split('')[0])
              .filter((name) => name === name.toUpperCase())
              .join('. ')}.`

          member.setNickname(nickname)
            .catch((err) => { bot.logger.error((err as Error).stack) })

          if (guild.volunteer_role_id != null) {
            member.roles.add(guild.volunteer_role_id)
              .catch((err) => { bot.logger.error((err as Error).stack) })
          }

          if (!volunteer.discord.includes(member.id)) {
            volunteer.discord.push(member.id)
          }

          volunteer.save().catch((err) => { bot.logger.error((err as Error).stack) })
        }).catch((err) => { bot.logger.error((err as Error).stack) })
      }).catch((err) => { bot.logger.error((err as Error).stack) })
    }).catch((err) => { bot.logger.error((err as Error).stack) })
  }
}
