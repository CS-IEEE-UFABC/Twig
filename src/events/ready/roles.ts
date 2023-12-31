import type Bot from '../../bot'
import { type Event } from '../eventHandler'
import addRolesIfNeeded from '../../utils/roles'

export default class Roles implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute (bot: Bot): Promise<void> {
    bot.client.guilds.cache.forEach((guild) => {
      guild.members.fetch({}).then((members) => {
        addRolesIfNeeded(
          bot,
          Array.from(members.values())
        )
      }).catch((e) => bot.logger.error({
        message: (e as Error).stack,
        scope: 'Ready/Roles#execute'
      }))
    })
  }
}
