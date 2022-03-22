/* eslint-disable no-console */
import { Platform } from 'react-native';

const LogLevelEnum = {
  'none': 0,
  'log': 1,
  'error': 2,
  'warn': 3,
  'info': 4,
  'debug': 5,
};
type LogLevel = keyof typeof LogLevelEnum;

const logger = (lv: LogLevel = 'warn') => {
  let _logLevel = __DEV__ ? lv : 'none';
  let _title = `[UIKit_${Platform.OS}]`;

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
      if (LogLevelEnum[_logLevel] < LogLevelEnum.log) return LogLevelEnum.none;
      console.log(_title, ...args);
      return LogLevelEnum[_logLevel];
    },
    error(...args: unknown[]) {
      if (LogLevelEnum[_logLevel] < LogLevelEnum.error) return LogLevelEnum.none;
      console.error(_title, ...args);
      return LogLevelEnum[_logLevel];
    },
    warn(...args: unknown[]) {
      if (LogLevelEnum[_logLevel] < LogLevelEnum.warn) return LogLevelEnum.none;
      console.warn(_title, ...args);
      return LogLevelEnum[_logLevel];
    },
    info(...args: unknown[]) {
      if (LogLevelEnum[_logLevel] < LogLevelEnum.info) return LogLevelEnum.none;
      console.info(_title, ...args);
      return LogLevelEnum[_logLevel];
    },
    debug(...args: unknown[]) {
      if (LogLevelEnum[_logLevel] < LogLevelEnum.debug) return LogLevelEnum.none;
      console.log(_title, ...args);
      return LogLevelEnum[_logLevel];
    },
  };
};

export const Logger = {
  ...logger(),
  LogLevelEnum,
  create: logger,
};
