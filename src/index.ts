import 'dotenv/config'
import logger from "./utils/logger"
import { join } from "path"
import { ShardingManager } from 'discord.js';

const manager = new ShardingManager(
  join(__dirname, './bot.js'), { token: process.env.DISCORD_TOKEN });

const info = logger("Sharding").info

manager.on('shardCreate', shard => {
  info(`Launched shard ${shard.id}`)
});

manager.spawn({ amount: 2 });
