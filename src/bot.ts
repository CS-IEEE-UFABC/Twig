import { Client, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger';
import EventHandler from './events/eventHandler';
import Presence from './utils/presence';
import database from './utils/firebase';
import CommandHandler from './commands/commandHandler';
import winston from 'winston';


export default class Bot {
  client: Client<boolean>;
  database = database;
  eventHandler: EventHandler;
  logger: winston.Logger;
  presence: Presence;
  commandHandler: CommandHandler;


  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent],
    });

    this.logger = logger(this.client.shard!.ids[0].toString())

    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
    this.presence = new Presence(this);
  }

  login(token: string) {
    this.client.login(token);
  }
}

new Bot().login(process.env.TOKEN!);
