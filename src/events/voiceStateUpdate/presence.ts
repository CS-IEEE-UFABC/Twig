import { VoiceState } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Presence implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, oldVS: VoiceState, newVS: VoiceState) {
    bot.presence.update()
  }
}
