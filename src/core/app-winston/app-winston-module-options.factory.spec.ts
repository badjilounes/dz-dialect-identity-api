import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as colors from 'colors/safe';

// import { RequestContextService } from '../request-context/request-context.service';

import { AppWinstonModuleOptionsFactory } from './app-winston-module-options.factory';

describe('AppWinstonModuleOptionsFactory', () => {
  let factory: AppWinstonModuleOptionsFactory;
  let configService: ConfigService;
  // let requestContextService: RequestContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        // RequestContextService,
        AppWinstonModuleOptionsFactory,
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    // requestContextService = module.get<RequestContextService>(
    //   RequestContextService,
    // );
    factory = module.get<AppWinstonModuleOptionsFactory>(AppWinstonModuleOptionsFactory);

    jest.spyOn(configService, 'get').mockImplementation((key: string): any => {
      const config: { [key: string]: any } = {
        LOG_LEVEL: 'debug',
      };
      return config[key];
    });
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  it('should set dateTime into log info', () => {
    let info: any = {};
    const format = factory.format.dateTime();
    info = format.transform(info);

    expect(info.dateTime).toBeTruthy();
  });

  it('should not set dateTime into log info', () => {
    const previousDateTime = new Date().toISOString();
    let info: any = { dateTime: previousDateTime };
    const format = factory.format.dateTime();
    info = format.transform(info);

    expect(info.dateTime).toEqual(previousDateTime);
  });

  // it('should set locale into log info', () => {
  //   const locale = 'fr_FR';
  //   jest
  //     .spyOn(requestContextService, 'tryGet')
  //     .mockImplementation((key: string): any => {
  //       const context: { [key: string]: any } = { localeKey: locale };
  //       return context[key];
  //     });

  //   let info: any = {};
  //   const format = factory.format.locale();
  //   info = format.transform(info);

  //   expect(info.locale).toBe(locale);
  // });

  // it('should not set locale into log info', () => {
  //   const previousLocale = 'en_US';
  //   const locale = 'fr_FR';
  //   jest
  //     .spyOn(requestContextService, 'tryGet')
  //     .mockImplementation((key: string): any => {
  //       const context: { [key: string]: any } = { localeKey: locale };
  //       return context[key];
  //     });

  //   let info: any = { locale: previousLocale };
  //   const format = factory.format.locale();
  //   info = format.transform(info);

  //   expect(info.locale).toBe(previousLocale);
  // });

  // it('should set request id into log info', () => {
  //   const requestId = 'request_id';
  //   jest
  //     .spyOn(requestContextService, 'currentRequestId', 'get')
  //     .mockImplementation(() => requestId);

  //   let info: any = {};
  //   const format = factory.format.request();
  //   info = format.transform(info);

  //   expect(info.request.id).toBe(requestId);
  // });

  // it('should not set request id into log info', () => {
  //   const previousRequest = 'previous_request_id';
  //   const request = 'request_id';
  //   jest
  //     .spyOn(requestContextService, 'currentRequestId', 'get')
  //     .mockImplementation(() => request);

  //   let info: any = { request: previousRequest };
  //   const format = factory.format.request();
  //   info = format.transform(info);

  //   expect(info.request).toBe(previousRequest);
  // });

  it('should pretty print log', () => {
    const format = factory.format.prettyPrint();
    const info = {
      context: 'LocaleMiddleware',
      dateTime: '2020-03-30 16:55:42.452',
      level: 'debug',
      locale: 'fr_FR',
      message: '[34mLocale set into context[39m',
      ms: '+8s',
      pid: '4550',
      request: { id: '7d73934e-10d2-443d-9a41-7077fd72da06', time: 800 },
    };
    const prettyPrinted: any = format.transform(info);
    const expected = [
      colors.green('[LVApp]'),
      colors.green('4550\t'),
      colors.yellow('Debug\t'),
      colors.cyan('[7d73934e-10d2-443d-9a41-7077fd72da06]'),
      colors.white('800ms\t'),
      colors.gray('[fr_FR]'),
      colors.yellow('[LocaleMiddleware]'),
      '[34mLocale set into context[39m',
      colors.yellow('+8s'),
      '',
    ].join(' ');

    expect(prettyPrinted[Symbol.for('message')].toString()).toEqual(expected.toString());
  });

  it('should create winston module options', () => {
    const options = factory.createWinstonModuleOptions();
    expect(options).toBeDefined();
    expect(options.transports).toHaveLength(1);
  });
});
