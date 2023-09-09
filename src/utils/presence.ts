import { ActivityType, type Guild, type ClientPresence, type VoiceChannel, type VoiceState } from 'discord.js'
import type Bot from '../bot'

export default class Presenece {
  private readonly bot: Bot
  private timeout: NodeJS.Timeout | undefined
  private lastVC: string | null = ''

  constructor (bot: Bot) {
    this.bot = bot
  }

  update (timeout: boolean = false): void {
    if (this.bot.client.guilds.cache.size === 0) return

    const channels = (this.bot.client.guilds.cache.first() as Guild).voiceStates.cache.filter(vs => vs.channelId !== null)

    if (!timeout) {
      if (channels?.find((vs) => vs.channelId === this.lastVC) != null) {
        return
      }
    }

    clearTimeout(this.timeout)

    if (channels?.size === 0) {
      if (this.lastVC == null) return

      this.setPresence('CS 🧡', ActivityType.Playing)
      this.lastVC = null
    } else {
      this.timeout = setTimeout(() => {
        this.update(true)
      }, 9e4)

      const vc = (channels.random() as VoiceState).channel
      if (vc == null) return

      if (this.lastVC === vc.id) return
      this.setPresence(vc.name, ActivityType.Watching)
      this.lastVC = vc.id
    }
  }

  reconnect (): void {
    this.lastVC = ''
    this.update(false)
  }

  updateVCName (vc: VoiceChannel): void {
    if (vc.id === this.lastVC) {
      this.setPresence(vc.name, ActivityType.Watching)
    }
  }

  private setPresence (name: string, type: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing | undefined): void {
    const presence = this.bot.client.user?.setPresence({
      activities: [{ name, type }],
      status: 'idle'
    })

    this.bot.logger.verbose(`Presence updated '${Object.values(ActivityType)[(presence as ClientPresence).activities[0].type]} ${(presence as ClientPresence).activities[0].name}'`)
  }
}
