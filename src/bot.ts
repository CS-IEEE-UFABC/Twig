import { Client, Collection, GatewayIntentBits } from 'discord.js'
import logger from './utils/logger'
import EventHandler from './events/eventHandler'
import Presence from './utils/presence'
import database from './utils/database'
import CommandHandler from './commands/commandHandler'
import type winston from 'winston'
import type mongoose from 'mongoose'

export default class Bot {
  client: Client<boolean>
  eventHandler: EventHandler
  logger: winston.Logger
  presence: Presence
  commandHandler: CommandHandler
  db: typeof mongoose | undefined
  invites = new Collection<string, Collection<string, number>>()

  constructor () {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, GatewayIntentBits.GuildInvites]
    })

    this.logger = logger(this.client.shard?.ids[0].toString() as string)

    this.commandHandler = new CommandHandler(this)
    this.eventHandler = new EventHandler(this)
    this.presence = new Presence(this)
  }

  async login (token: string): Promise<void> {
    this.db = await database()
    this.client.login(token)
      .catch((err) => { this.logger.error((err as Error).stack) })
  }
}

void new Bot().login(process.env.TOKEN as string)
