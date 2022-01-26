/* eslint-disable no-console */
export enum LogLevel {
  'none',
  'log',
  'error',
  'warn',
  'info',
  'debug',
}
export const createLogger = (lv: LogLevel | 0 | 1 | 2 | 3 | 4 | 5 = 3) => {
  let _logLevel: LogLevel = lv;
  let _title = '[SendbirdUIKit]';
  const base = {
    log: (...args: unknown[]) => console.log(_title, ...args),
    error: (...args: unknown[]) => console.error(_title, ...args),
    warn: (...args: unknown[]) => console.warn(_title, ...args),
    info: (...args: unknown[]) => console.info(_title, ...args),
  };

  return {
    setTitle(title: string) {
      _title = title;
    },
    setLogLevel(lv: LogLevel) {
      _logLevel = lv;
    },
    getLogLevel() {
      return _logLevel;
    },
    log(...args: unknown[]) {
      if (_logLevel < LogLevel.log) return;
      base.log(...args);
    },
    error(...args: unknown[]) {
      if (_logLevel < LogLevel.error) return;
      base.error(...args);
    },
    warn(...args: unknown[]) {
      if (_logLevel < LogLevel.warn) return;
      base.warn(...args);
    },
    info(...args: unknown[]) {
      if (_logLevel < LogLevel.info) return;
      base.info(...args);
    },
    debug(...args: unknown[]) {
      if (_logLevel < LogLevel.debug) return;
      base.log(...args);
    },
  };
};

export const Logger = {
  ...createLogger(),
  create: createLogger,
};
