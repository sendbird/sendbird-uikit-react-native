import { Logger } from '../shared/logger';

jest.mock('react-native', () => {
  return { Platform: { OS: 'android' } };
});

// FIXME: spy isolation
describe('createLogger/Logger', function () {
  const spies = {
    log: jest.spyOn(global.console, 'log').mockImplementation(() => true),
    error: jest.spyOn(global.console, 'error').mockImplementation(() => true),
    warn: jest.spyOn(global.console, 'warn').mockImplementation(() => true),
    info: jest.spyOn(global.console, 'info').mockImplementation(() => true),
  };
  afterAll(function () {
    jest.clearAllMocks();
  });

  test('create', function () {
    const logger = Logger.create('info');
    expect(logger.getLogLevel()).toEqual('info');
  });
  test('LogLevelEnum', function () {
    expect(Logger.LogLevelEnum.none).toEqual(0);
    expect(Logger.LogLevelEnum.log).toEqual(1);
    expect(Logger.LogLevelEnum.error).toEqual(2);
    expect(Logger.LogLevelEnum.warn).toEqual(3);
    expect(Logger.LogLevelEnum.info).toEqual(4);
    expect(Logger.LogLevelEnum.debug).toEqual(5);
  });

  test('setLogLevel/none', function () {
    Logger.setLogLevel('none');
    expect(Logger.getLogLevel()).toEqual('none');

    expect(Logger.log('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.error('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.warn('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.info('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.debug('')).toBe(Logger.LogLevelEnum.none);

    expect(spies.log).not.toHaveBeenCalled();
    expect(spies.error).not.toHaveBeenCalled();
    expect(spies.warn).not.toHaveBeenCalled();
    expect(spies.info).not.toHaveBeenCalled();
  });

  test('setLogLevel/log', function () {
    Logger.setLogLevel('log');
    expect(Logger.getLogLevel()).toEqual('log');

    expect(Logger.log('')).toBe(Logger.LogLevelEnum.log);
    expect(Logger.error('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.warn('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.info('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.debug('')).toBe(Logger.LogLevelEnum.none);

    expect(spies.log).toHaveBeenCalledTimes(1);
    expect(spies.error).not.toHaveBeenCalled();
    expect(spies.warn).not.toHaveBeenCalled();
    expect(spies.info).not.toHaveBeenCalled();
  });

  test('setLogLevel/error', function () {
    Logger.setLogLevel('error');
    expect(Logger.getLogLevel()).toEqual('error');

    expect(Logger.log('')).toBe(Logger.LogLevelEnum.error);
    expect(Logger.error('')).toBe(Logger.LogLevelEnum.error);
    expect(Logger.warn('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.info('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.debug('')).toBe(Logger.LogLevelEnum.none);

    expect(spies.log).toHaveBeenCalledTimes(2);
    expect(spies.error).toHaveBeenCalledTimes(1);
    expect(spies.warn).not.toHaveBeenCalled();
    expect(spies.info).not.toHaveBeenCalled();
  });

  test('setLogLevel/warn', function () {
    Logger.setLogLevel('warn');
    expect(Logger.getLogLevel()).toEqual('warn');

    expect(Logger.log('')).toBe(Logger.LogLevelEnum.warn);
    expect(Logger.error('')).toBe(Logger.LogLevelEnum.warn);
    expect(Logger.warn('')).toBe(Logger.LogLevelEnum.warn);
    expect(Logger.info('')).toBe(Logger.LogLevelEnum.none);
    expect(Logger.debug('')).toBe(Logger.LogLevelEnum.none);

    expect(spies.log).toHaveBeenCalledTimes(3);
    expect(spies.error).toHaveBeenCalledTimes(2);
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.info).not.toHaveBeenCalled();
  });

  test('setLogLevel/info', function () {
    Logger.setLogLevel('info');
    expect(Logger.getLogLevel()).toEqual('info');

    expect(Logger.log('')).toBe(Logger.LogLevelEnum.info);
    expect(Logger.error('')).toBe(Logger.LogLevelEnum.info);
    expect(Logger.warn('')).toBe(Logger.LogLevelEnum.info);
    expect(Logger.info('')).toBe(Logger.LogLevelEnum.info);
    expect(Logger.debug('')).toBe(Logger.LogLevelEnum.none);

    expect(spies.log).toHaveBeenCalledTimes(4);
    expect(spies.error).toHaveBeenCalledTimes(3);
    expect(spies.warn).toHaveBeenCalledTimes(2);
    expect(spies.info).toHaveBeenCalledTimes(1);
  });

  test('setLogLevel/debug', function () {
    Logger.setLogLevel('debug');
    expect(Logger.getLogLevel()).toEqual('debug');

    expect(Logger.log('')).toBe(Logger.LogLevelEnum.debug);
    expect(Logger.error('')).toBe(Logger.LogLevelEnum.debug);
    expect(Logger.warn('')).toBe(Logger.LogLevelEnum.debug);
    expect(Logger.info('')).toBe(Logger.LogLevelEnum.debug);
    expect(Logger.debug('')).toBe(Logger.LogLevelEnum.debug);

    expect(spies.log).toHaveBeenCalledTimes(6);
    expect(spies.error).toHaveBeenCalledTimes(4);
    expect(spies.warn).toHaveBeenCalledTimes(3);
    expect(spies.info).toHaveBeenCalledTimes(2);
  });
});
