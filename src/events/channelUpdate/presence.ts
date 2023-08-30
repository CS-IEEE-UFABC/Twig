import { type VoiceChannel } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Presence implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, oldVC: VoiceChannel, newVC: VoiceChannel): Promise<void> {
    bot.presence.updateVCName(newVC)
  }
}
