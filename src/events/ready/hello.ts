import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute(bot: Bot) {
    bot.logger.info(`Shard ${bot.client.shard!.ids[0]!} ready!`)
  }
}
