import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Log implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, error: Error): Promise<void> {
    bot.logger.error({
      message: error.stack,
      scope: 'ShardError/Log#execute'
    })
  }
}
