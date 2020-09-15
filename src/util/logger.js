import chalk from 'chalk';
import { createLogger, format, transports } from 'winston';
import { inspect } from 'util';
import { DateTime } from 'luxon';
import RotateFile from 'winston-daily-rotate-file';

export default class Logger {
    logger: Any = createLogger({
        format: format.combine(
            format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
            format.json({ space: 0 }),
            //format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
        ),
      transports: [
        new transports.Console({
            format: this.baseFormat()
        }),
          new transports.DailyRotateFile({
              filename: '%DATE%.log',
              dirname: `${process.cwd()}/logs`,
              maxFiles: '14d',
              maxSize: '256m',
              json: true,
          }),
        // new RotateFile({
        //   filename: '%DATE%.log',
        //   dirname: `${process.cwd()}/logs`,
        //   maxFiles: '15d',
        //   maxSize: '256m',
        //   json: true,
        // }),
      ],
      exitOnError: false,
      //format: this.baseFormat(),
    });

    baseFormat() {
      const formatMessage = (log) => `${this.setColour('timestamp', this.time)}: [${this.setColour(log.level)}] ${log.message}`;
      const formatError = (log) => `${this.setColour('timestamp', this.time)}: [${this.setColour(log.level)}] ${log.message}\n ${log.stack}\n`;
      const _format = (log) => (log instanceof Error
        ? formatError(log)
        : formatMessage(
          typeof log.message === 'string'
            ? log
            : Object.create({ level: log.level, message: inspect(log.message, { showHidden: true, depth: 1 }) }),
        ));

      return format.combine(format.printf(_format));
    }

    setColour(type: string, content?: string) {
      type = type.toUpperCase();

      switch (type.toLowerCase()) {
        default: return chalk.cyan(type);
        case 'info': return chalk.greenBright(type);
        case 'debug': return chalk.magentaBright(type); ss;
        case 'warn': return chalk.yellowBright(type);
        case 'error': return chalk.redBright(type);
        case 'timestamp': return chalk.bgMagenta.whiteBright(content);
      }
    }

    get time() {
      return DateTime.local().toFormat('dd/MM/yyyy, HH:mm:ss.S');
    }
}
