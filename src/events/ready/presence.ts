import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Presence implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute(bot: Bot) {
    bot.presence.update()
  }
}
