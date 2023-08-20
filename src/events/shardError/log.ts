import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, error: Error) {
    bot.logger.error((error as Error).stack)
  }
}
