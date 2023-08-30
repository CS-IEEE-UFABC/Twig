import 'dotenv/config'
import Logger from './utils/logger'
import { join } from 'path'
import { ShardingManager } from 'discord.js'

const manager = new ShardingManager(
  join(__dirname, './bot.js'), { token: process.env.DISCORD_TOKEN })

const logger = Logger('Sharding')

manager.on('shardCreate', shard => {
  logger.info(`Launched shard ${shard.id}`)
})

manager.spawn({ amount: 2 }).catch((err) => { logger.error((err as Error).stack) })
