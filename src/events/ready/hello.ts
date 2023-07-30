import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: false,
    once: false
  }

  async execute(bot: Bot) {
    bot.logger.info(`Hello, World!! ${bot.client.user?.username} is ready!`)

    bot.presence.update()
  }
}
