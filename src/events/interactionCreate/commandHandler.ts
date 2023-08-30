import { type Interaction } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class CommandHandler implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute (bot: Bot, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return

    const command = bot.commandHandler.commmands.get(interaction.commandName)

    if (command == null) return

    try {
      await command.execute(bot, interaction)
    } catch (error) {
      bot.logger.error((error as Error).stack)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
      }
    }
  }
}
