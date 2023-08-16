import { ChatInputCommandInteraction, Collection, SlashCommandBuilder } from 'discord.js';
import { statSync, readdirSync } from "node:fs"
import { join } from "node:path"
import Bot from '../bot';

export default class CommandHandler {
  commmands = new Collection<string, Command>();
  bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;

    this._loadAllCommands();
  }

  _loadAllCommands() {
    readdirSync(__dirname)
      .filter((f) => statSync(join(__dirname, f)).isDirectory())
      .forEach((commandCategoryDir) => {
        readdirSync(join(__dirname, commandCategoryDir))
          .filter((f) => f.endsWith(".js")).forEach((file) => {
            try {
              this.loadCommand(commandCategoryDir, file);
            } catch (e) {
              this.bot.logger.warn(e);
            }
          })
      })
  }

  loadCommand(commandCategory: string, commandFile: string) {
    var command = new (require(join(__dirname, commandCategory, commandFile)).default)() as Command;

    if ('data' in command && 'execute' in command) {
      this.commmands.set(command.data.name, command);

      this.bot.logger.verbose(`Command '${commandCategory}/${commandFile}' was loaded.`)
    } else {
      throw new Error(`Command '${commandCategory}/${commandFile}' does not have the required properties.`)
    }

  }
}

interface Command {
  data: SlashCommandBuilder;
  execute: (bot: Bot, interaction: ChatInputCommandInteraction) => Promise<void>;
}
