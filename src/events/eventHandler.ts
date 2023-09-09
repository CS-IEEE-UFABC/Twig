import { Collection, Events } from 'discord.js'
import { statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type Bot from '../bot'

export default class EventHandler {
  private readonly bot: Bot
  events = new Collection<string, Collection<string, Event>>()

  constructor (bot: Bot) {
    this.bot = bot
    const { total, errors } = this.loadAllEvents()
    this.bot.logger.info({
      message: `Total of ${total - errors}/${total} events were loaded.`,
      scope: 'EventHandler#load'
    })
  }

  private loadAllEvents (): { total: number, errors: number } {
    let total = 0
    let errors = 0

    readdirSync(__dirname)
      .filter((f) => statSync(join(__dirname, f)).isDirectory())
      .forEach((eventNameDir) => {
        readdirSync(join(__dirname, eventNameDir))
          .filter((f) => f.endsWith('.js')).forEach((file) => {
            try {
              total++
              this.loadEvent(eventNameDir, file)
            } catch (e) {
              errors++
              this.bot.logger.warn({
                message: (e as Error).stack,
                scope: 'EventHandler#load'
              })
            }
          })
      })

    return {
      total,
      errors
    }
  }

  loadEvent (eventName: string, eventFile: string): void {
    if (!Object.values(Events).includes(eventName as any)) {
      throw new Error(`ClientEvent "${eventName}" does not exist.`)
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires, new-cap
    const event = new (require(join(__dirname, eventName, eventFile)).default)() as Event

    if ('data' in event && 'execute' in event) {
      if (!this.events.has(eventName)) {
        this.events.set(eventName, new Collection())
      }

      this.events.get(eventName)?.set(eventName, event)

      if (event.data.enabled) {
        if (event.data.once) {
          this.bot.client.once(eventName, (...args) => event.execute(this.bot, ...args))
        } else {
          this.bot.client.on(eventName, (...args) => event.execute(this.bot, ...args))
        }
      }

      this.bot.logger.debug({
        message: `Event '${eventName}/${eventFile}' was loaded.`,
        scope: 'EventHandler#load'
      })
    } else {
      throw new Error(`Event '${eventName}/${eventName}' does not have the required properties.`)
    }
  }
}

export interface Event {
  data: {
    enabled: boolean
    once: boolean
  }
  execute: any
}
