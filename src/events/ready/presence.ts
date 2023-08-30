import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Presence implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute (bot: Bot): Promise<void> {
    bot.presence.update()
  }
}
