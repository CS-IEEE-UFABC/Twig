import { type AutocompleteInteraction, type ChatInputCommandInteraction, Collection, type SlashCommandBuilder } from 'discord.js'
import { statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type Bot from '../bot'

export default class CommandHandler {
  commmands = new Collection<string, Command>()
  bot: Bot

  constructor (bot: Bot) {
    this.bot = bot

    this._loadAllCommands()
  }

  _loadAllCommands (): void {
    readdirSync(__dirname)
      .filter((f) => statSync(join(__dirname, f)).isDirectory())
      .forEach((commandCategoryDir) => {
        readdirSync(join(__dirname, commandCategoryDir))
          .filter((f) => f.endsWith('.js')).forEach((file) => {
            try {
              this.loadCommand(commandCategoryDir, file)
            } catch (e) {
              this.bot.logger.warn((e as Error).stack)
            }
          })
      })
  }

  loadCommand (commandCategory: string, commandFile: string): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, new-cap
    const command = new (require(join(__dirname, commandCategory, commandFile)).default)() as Command

    if ('data' in command && 'execute' in command) {
      this.commmands.set(command.data.name, command)

      this.bot.logger.verbose(`Command '${commandCategory}/${commandFile}' was loaded.`)
    } else {
      throw new Error(`Command '${commandCategory}/${commandFile}' does not have the required properties.`)
    }
  }
}

interface Command {
  data: SlashCommandBuilder
  execute: (bot: Bot, interaction: ChatInputCommandInteraction) => Promise<void>
  autocomplete?: (bot: Bot, interaction: AutocompleteInteraction) => Promise<void>
}
