import { VoiceChannel } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, oldVC: VoiceChannel, newVC: VoiceChannel) {
    bot.presence.updateVCName(newVC)
  }
}
