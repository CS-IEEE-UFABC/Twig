import { ActivityType } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot) {
    bot.logger.info(`Hello, World!! ${bot.client.user?.username} is ready!`)

    bot.client.user?.setPresence({
      activities: [{ name: "CS 🧡", type: ActivityType.Playing }],
      status: "idle"
    })
  }
}
