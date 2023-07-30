import 'dotenv/config'
import Bot from './bot'

new Bot().login(process.env.DISCORD_TOKEN)
