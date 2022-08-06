import { Logger } from '@nestjs/common';
import { Logger as TypeormLogger } from 'typeorm';

export class AppTypeormLogger implements TypeormLogger {
  logger = new Logger('Typeorm');

  logQuery(query: string, parameters?: any[]) {
    this.logger.debug(`[QUERY] ${this.queryToString(query, parameters)}`);
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger.error(`[QUERY-ERROR] ${error} -- ${this.queryToString(query, parameters)}`);
  }
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(`[QUERY-SLOW] ${time}ms -- ${this.queryToString(query, parameters)}`);
  }
  logSchemaBuild(message: string) {
    this.logger.verbose(`[SCHEMA-BUILD] ${message}`);
  }
  logMigration(message: string) {
    this.logger.verbose(`[MIGRATION] ${message}`);
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
