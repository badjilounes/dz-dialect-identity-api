import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger as TypeormLogger } from 'typeorm';

export class AppTypeormLogger implements TypeormLogger {
  logger = new Logger('Typeorm');

  private readonly logLevel = this.configService.get('TYPEORM_LOGGING');

  constructor(private readonly configService: ConfigService) {}

  logQuery(query: string, parameters?: any[]) {
    if (this.logLevel === 'all' || this.logLevel === 'query') {
      this.logger.debug(`[QUERY] ${this.queryToString(query, parameters)}`);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    if (this.logLevel === 'all' || this.logLevel === 'error') {
      this.logger.error(`[QUERY-ERROR] ${error} -- ${this.queryToString(query, parameters)}`);
    }
  }
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    if (this.logLevel === 'all' || this.logLevel === 'query') {
      this.logger.warn(`[QUERY-SLOW] ${time}ms -- ${this.queryToString(query, parameters)}`);
    }
  }
  logSchemaBuild(message: string) {
    if (this.logLevel === 'all' || this.logLevel === 'schema') {
      this.logger.verbose(`[SCHEMA-BUILD] ${message}`);
    }
  }
  logMigration(message: string) {
    if (this.logLevel === 'all' || this.logLevel === 'query') {
      this.logger.verbose(`[MIGRATION] ${message}`);
    }
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    const logMethodMap = {
      log: this.logger.log,
      info: this.logger.verbose,
      warn: this.logger.warn,
    };
    logMethodMap[level].call(this.logger, message);
  }

  private queryToString(query: string, parameters?: any[]) {
    return `${query}${this.parametersToString(parameters)}`;
  }

  private parametersToString(parameters?: any) {
    return parameters ? ` -- Parameters : ${JSON.stringify(parameters)}` : '';
  }
}
