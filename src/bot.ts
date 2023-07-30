import { Client, GatewayIntentBits } from 'discord.js';
import { Logger } from 'winston';
import logger from './utils/logger';
import EventHandler from './events/eventHandler';

export default class Bot {
  logger: Logger;
  client: Client<boolean>;
  eventHandler: EventHandler;

  constructor() {
    this.logger = logger;
    this.client = new Client({ intents: [GatewayIntentBits.Guilds], });
    this.eventHandler = new EventHandler(this);
  }

  login(token: string) {
    this.client.login(token);
  }
}
