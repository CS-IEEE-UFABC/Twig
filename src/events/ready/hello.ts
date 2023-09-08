import { type ShardClientUtil } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Hello implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute (bot: Bot): Promise<void> {
    bot.logger.info({
      message: `Shard ${(bot.client.shard as ShardClientUtil).ids[0]} ready!`,
      scope: 'Ready/Hello#execute'
    })
  }
}
