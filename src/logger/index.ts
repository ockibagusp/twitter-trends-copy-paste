import { type Logger as LoggerBase, LoggerFactory as LoggerFactoryBase } from 'lines-logger'

const factory: LoggerFactoryBase = new LoggerFactoryBase()
export const log: LoggerBase = factory.getLogger('')

export class Logger {
  public constructor(name?: string): LoggerBase {
    if (name == undefined) {
      return this.get('')
    } else {
      return this.get(name)
    }
  }

  private get(name: string): LoggerBase {
    const factory: LoggerFactoryBase = new LoggerFactoryBase()
    return factory.getLogger(name)
  }
}
