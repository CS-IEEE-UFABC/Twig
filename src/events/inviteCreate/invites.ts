import { type Invite, Collection } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, invite: Invite): Promise<undefined> {
    if (invite.guild === null) return
    let botInvites = bot.invites.get(invite.guild.id)

    if (botInvites === undefined) {
      bot.invites.set(invite.guild.id, new Collection())
      botInvites = bot.invites.get(invite.guild.id) as Collection<string, number>
    }

    botInvites.set(invite.code, invite.uses ?? 0)
  }
}
