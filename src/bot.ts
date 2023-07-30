import { Client, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger';
import EventHandler from './events/eventHandler';
import Presence from './utils/presence';

export default class Bot {
  logger = logger;
  client: Client<boolean>;
  eventHandler: EventHandler;
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
