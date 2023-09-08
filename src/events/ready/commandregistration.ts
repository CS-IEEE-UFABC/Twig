import { Routes, type User } from 'discord.js'
import type Bot from '../../bot'
import { type Event } from '../eventHandler'

export default class CommandRegistration implements Event {
  data = {
    enabled: true,
    once: true
  }

  async execute (bot: Bot): Promise<void> {
    bot.client.rest.put(Routes.applicationCommands((bot.client.user as User).id), {
      body: bot.commandHandler.commmands.map((c) => c.data.toJSON())
    }).catch((e) => bot.logger.error({
      message: (e as Error).stack,
      scope: 'Ready/CommandRegistration#execute'
    }))
  }
}
