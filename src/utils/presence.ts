import { ActivityType, VoiceChannel } from "discord.js"
import Bot from "../bot";

export default class Presenece {
  private bot: Bot;
  private timeout: NodeJS.Timeout | undefined;
  private lastVC: string | null = "";

  constructor(bot: Bot) {
    this.bot = bot;
  }

  update(timeout: boolean = false) {
    if (this.bot.client.guilds.cache.size == 0) return

    var channels = this.bot.client.guilds.cache.first()!.voiceStates.cache.filter(vs => vs.channelId !== null)

    if (timeout == false) {
      if (channels?.find((vs) => vs.channelId == this.lastVC)) {
        return
      }
    }

    clearTimeout(this.timeout)

    if (!channels || channels.size == 0) {
      if (this.lastVC == null) return;

      this.setPresence("CS 🧡", ActivityType.Playing)
      this.lastVC = null
    } else {
      var vc = channels.random()!.channel!

      this.timeout = setTimeout(() => {
        this.update(true)
      }, 9e4)

      if (this.lastVC == vc.id) return
      this.setPresence(vc.name!, ActivityType.Watching)
      this.lastVC = vc.id
    }
  }

  updateVCName(vc: VoiceChannel) {
    if (vc.id == this.lastVC) {
      this.setPresence(vc.name!, ActivityType.Watching)
    }
  }

  private setPresence(name: string, type: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing | undefined) {
    var presence = this.bot.client.user?.setPresence({
      activities: [{ name: name, type: type }],
      status: "idle"
    })

    this.bot.logger.debug(`Presence updated '${Object.values(ActivityType)[presence!.activities[0].type!]} ${presence!.activities[0].name}'`)
  }
}
