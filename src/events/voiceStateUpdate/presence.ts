import { type VoiceState } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Presence implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, oldVS: VoiceState, newVS: VoiceState): Promise<void> {
    bot.presence.update()
  }
}
