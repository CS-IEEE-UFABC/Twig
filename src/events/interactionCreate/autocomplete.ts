import { type Interaction } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class Autocomplete implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, interaction: Interaction): Promise<void> {
    if (!interaction.isAutocomplete()) return
    const command = bot.commandHandler.commmands.get(interaction.commandName)

    if (command?.autocomplete == null) return
    try {
      await command.autocomplete(bot, interaction)
    } catch (e) {
      bot.logger.error({
        message: (e as Error).stack,
        scope: 'interactionCreate/Autocomplete#execute'
      })
    }
  }
}
