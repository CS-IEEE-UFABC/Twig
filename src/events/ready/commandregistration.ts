import { Routes } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute(bot: Bot) {
    bot.client.rest.put(Routes.applicationCommands(bot.client.user!.id), {
      body: bot.commandHandler.commmands.map((c) => c.data.toJSON())
    })
  }
}
