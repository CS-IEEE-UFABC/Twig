import { Client, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger';
import EventHandler from './events/eventHandler';
import Presence from './utils/presence';
import database from './utils/firebase';


export default class Bot {
  client: Client<boolean>;
  database = database;
  eventHandler: EventHandler;
  logger = logger;
  presence: Presence;


  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });

    this.eventHandler = new EventHandler(this);
    this.presence = new Presence(this);
  }

  login(token: string) {
    this.client.login(token);
  }
}
