import { type Guild, type Invite } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'
import GuildModel from '../../models/guild'

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, invite: Invite): Promise<void> {
    if (invite.guild == null) return

    bot.invites.get(invite.guild.id)?.delete(invite.code)
    GuildModel.findOne({ guildId: invite.guild.id }).then(async guild => {
      if (guild == null) {
        return await new GuildModel({
          guildId: (invite.guild as Guild).id,
          invites: []
        }).save()
      }

      guild.invites = guild?.invites.filter(i => i.code !== invite.code)
      guild.save().catch((e) => bot.logger.error({
        message: (e as Error).stack,
        scope: 'InviteDelete/Invites#execute'
      }))
    }).catch((e) => bot.logger.error({
      message: (e as Error).stack,
      scope: 'InviteDelete/Invites#execute'
    }))
  }
}
