import { type Logger, createLogger, format, transports } from 'winston'

export default (clusterId: string): Logger => {
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format(info => {
        info.cluster = clusterId
        return info
      })(),
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

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.printf(({ level, message, scope, timestamp }) => {
        return `${timestamp} [${clusterId}] (${level.toUpperCase()})${scope !== undefined ? ` {${scope}}` : ''}: ${message}`
      }),
      level: 'debug'
    }))
  }

  return logger
}
