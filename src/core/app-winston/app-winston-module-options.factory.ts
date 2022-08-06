import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as colors from 'colors/safe';
import { WinstonModuleOptionsFactory } from 'nest-winston';
import * as winston from 'winston';

@Injectable()
export class AppWinstonModuleOptionsFactory implements WinstonModuleOptionsFactory {
  format = {
    dateTime: winston.format((info) => {
      if (!info.dateTime) {
        info.dateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
      }
      return info;
    }),
    locale: winston.format((info) => {
      // if (!info.locale) {
      //   info.locale = this.requestContextService.tryGet<string>('localeKey');
      // }
      return info;
    }),
    process: winston.format((info) => {
      if (!info.pid) {
        info.pid = process.pid;
      }
      return info;
    }),
    request: winston.format((info) => {
      if (!info.request) {
        info.request = {
          // id: this.requestContextService.currentRequestId,
          // time: this.requestContextService.time(),
        };
      }
      return info;
    }),
    prettyPrint: () =>
      winston.format.printf((info) => {
        return [
          this.print('LVApp', [colors.green], '[', ']'),
          this.print(info.pid, [colors.green], '', '\t'),
          this.print(info.level, [this.capitalize, colors.yellow], '', '\t'),
          this.print(info.request?.id, [colors.cyan], '[', ']'),
          this.print(info.request?.time, [colors.white], '', 'ms\t'),
          this.print(info.locale, [colors.gray], '[', ']'),
          this.print(info.context, [colors.yellow], '[', ']'),
          this.print(info.message),
          this.print(info.ms, [colors.yellow]),
          this.print(JSON.stringify(info.meta), [colors.gray]),
          this.print(info.trace, [colors.gray]),
        ].join('');
      }),
  };

  constructor(
    private readonly configService: ConfigService, // private readonly requestContextService: RequestContextService,
  ) {}

  createWinstonModuleOptions(): winston.LoggerOptions {
    return {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            this.format.process(),
            this.format.dateTime(),
            winston.format.colorize({
              colors: {
                debug: 'magenta',
              },
              message: true,
            }),
            this.format.locale(),
            this.format.request(),
            winston.format.ms(),
            this.format.prettyPrint(),
          ),
          level: this.configService.get<string>('LOG_LEVEL'),
        }),
      ],
    };
  }

  private capitalize(str: string): string {
    return str && str[0].toUpperCase() + str.slice(1);
  }

  private print(text: string, transforms: ((str: string) => string)[] = [], before = '', after = ''): string {
    let formatted = '';
    if (text) {
      formatted = `${before}${text}${after}`;
      transforms.forEach((transform) => (formatted = transform(formatted)));
      formatted = `${formatted} `;
    }
    return formatted;
  }
}
