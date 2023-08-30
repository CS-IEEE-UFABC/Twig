import { type Logger, createLogger, format, transports } from 'winston'
const { printf } = format

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' })
  ]
})

export default (clusterId: string): Logger => {
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label ?? clusterId}] (${level.toUpperCase()}): ${message}`
      }),
      level: 'debug'
    }))
  }

  return logger
}
