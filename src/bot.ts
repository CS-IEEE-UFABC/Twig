import { Client, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger';
import EventHandler from './events/eventHandler';
import Presence from './utils/presence';
import database from './utils/firebase';
import CommandHandler from './commands/commandHandler';


export default class Bot {
  client: Client<boolean>;
  database = database;
  eventHandler: EventHandler;
  logger = logger(0);
  presence: Presence;
  commandHandler: CommandHandler;


  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent]
    });

    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
    this.presence = new Presence(this);
  }

  login(token: string) {
    this.client.login(token);
  }
}
