import { Interaction } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"

export default class Hello implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, interaction: Interaction) {
    if (!interaction.isAutocomplete()) return;
    const command = bot.commandHandler.commmands.get(interaction.commandName);

    if (!command || !command.autocomplete) return;
    try {
      await command.autocomplete(bot, interaction);
    } catch (error) {
      bot.logger.error((error as Error).stack);
    }
  }
}
