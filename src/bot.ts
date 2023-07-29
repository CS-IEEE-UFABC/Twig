import { Client, Events, GatewayIntentBits } from 'discord.js';

export class Bot {
  client: Client<boolean>;

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.client.once(Events.ClientReady, c => {
      console.log(`Ready! Logged in as ${c.user.tag}`);
    });
  }

  login() {
    this.client.login(process.env.token);
  }
}
