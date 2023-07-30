import { Client, GatewayIntentBits } from 'discord.js';
import EventHandler from './events/eventHandler';

export default class Bot {
  client: Client<boolean>;
  eventHandler: EventHandler;

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.eventHandler = new EventHandler(this);
  }

  login(token: string) {
    this.client.login(token);
  }
}
