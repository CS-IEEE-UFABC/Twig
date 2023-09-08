import { type AutocompleteInteraction, type ChatInputCommandInteraction, Collection, type SlashCommandBuilder } from 'discord.js'
import { statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type Bot from '../bot'

export default class CommandHandler {
  commmands = new Collection<string, Command>()
  bot: Bot

  constructor (bot: Bot) {
    this.bot = bot

    const { total, errors } = this._loadAllCommands()
    this.bot.logger.info({
      message: `Total of ${total - errors}/${total} commands were loaded.`,
      scope: 'CommandHandler#constructor'
    })
  }

  _loadAllCommands (): { total: number, errors: number } {
    let total = 0
    let errors = 0

    readdirSync(__dirname)
      .filter((f) => statSync(join(__dirname, f)).isDirectory())
      .forEach((commandCategoryDir) => {
        readdirSync(join(__dirname, commandCategoryDir))
          .filter((f) => f.endsWith('.js')).forEach((file) => {
            try {
              total++
              this.loadCommand(commandCategoryDir, file)
            } catch (e) {
              errors++
              this.bot.logger.warn({
                message: (e as Error).stack,
                scope: 'CommandHandler#loadAllEvents'
              })
            }
          })
      })

    return {
      total,
      errors
    }
  }

  loadCommand (commandCategory: string, commandFile: string): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, new-cap
    const command = new (require(join(__dirname, commandCategory, commandFile)).default)() as Command

    if ('data' in command && 'execute' in command) {
      this.commmands.set(command.data.name, command)

      this.bot.logger.verbose({
        message: `Command '${commandCategory}/${commandFile}' was loaded.`,
        scope: 'CommandHandler#loadCommand'
      })
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
