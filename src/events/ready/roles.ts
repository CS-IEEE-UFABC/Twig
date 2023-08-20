import Bot from "../../bot"
import { Event } from "../eventHandler"
import addRolesIfNeeded from "../../utils/roles"

export default class Roles implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute(bot: Bot) {
    bot.client.guilds.cache.forEach((guild) => {
      guild.members.fetch({})
        .then((members) => {
          addRolesIfNeeded(
            bot,
            Array.from(members.values()),
          )
        })
    })
  }
}
