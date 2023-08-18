import { Collection, Events } from "discord.js";
import { statSync, readdirSync } from "node:fs"
import { join } from "node:path"
import Bot from "../bot";


export default class EventHandler {
  private bot: Bot;
  events = new Collection<string, Collection<string, Event>>();

  constructor(bot: Bot) {
    this.bot = bot
    this.loadAllEvents();
  }

  private loadAllEvents() {
    readdirSync(__dirname)
      .filter((f) => statSync(join(__dirname, f)).isDirectory())
      .forEach((eventNameDir) => {
        readdirSync(join(__dirname, eventNameDir))
          .filter((f) => f.endsWith(".js")).forEach((file) => {
            try {
              this.loadEvent(eventNameDir, file);
            } catch (e) {
              this.bot.logger.warn((e as Error).stack);
            }
          })
      })
  }

  loadEvent(eventName: string, eventFile: string) {
    if (!Object.values(Events).includes(eventName as any)) {
      throw new Error(`ClientEvent "${eventName}" does not exist.`);
    }

    var event = new (require(join(__dirname, eventName, eventFile)).default)() as Event;

    if ('data' in event && 'execute' in event) {
      if (!this.events.has(eventName)) {
        this.events.set(eventName, new Collection());
      }

      this.events.get(eventName)!.set(eventName, event);

      if (event.data.enabled) {
        if (event.data.once) {
          this.bot.client.once(eventName, (...args) => event.execute(this.bot, ...args));
        } else {
          this.bot.client.on(eventName, (...args) => event.execute(this.bot, ...args));
        }
      }

      this.bot.logger.verbose(`Event '${eventName}/${eventFile}' was loaded.`)
    } else {
      throw new Error(`Event '${eventName}/${eventName}' does not have the required properties.`)
    }
  }
}

export interface Event {
  data: {
    enabled: boolean;
    once: boolean;
  }
  execute: any;
}
