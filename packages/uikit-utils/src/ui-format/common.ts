import type { Locale } from 'date-fns';
import { format, isThisYear, isToday, isYesterday } from 'date-fns';

import type { SendbirdBaseMessage } from '../types';

type TruncateMode = 'head' | 'mid' | 'tail';
type TruncateOption = { mode: TruncateMode; maxLen: number; separator: string };
const defaultOpts: TruncateOption = { mode: 'mid', maxLen: 40, separator: '...' };

/**
 * String truncate util
 * @param {string} str
 * @param {Object} opts Options for truncate
 * @param {'head' | 'mid' | 'tail'} opts.mode  default "mid"
 * @param {number} opts.maxLen  default 40
 * @param {string} opts.separator default "..."
 * @returns {string}
 * */
export const truncate = (str: string, opts: Partial<TruncateOption> = defaultOpts): string => {
  const options = { ...defaultOpts, ...opts };
  const { maxLen, mode, separator } = options;

  if (str.length <= maxLen) return str;

  if (mode === 'head') {
    return separator + str.slice(-maxLen);
  }

  if (mode === 'mid') {
    const lead = Math.ceil(maxLen / 2);
    const trail = Math.floor(maxLen / 2);
    return str.slice(0, lead) + separator + str.slice(-trail);
  }

  if (mode === 'tail') {
    return str.slice(0, maxLen) + separator;
  }

  throw new Error('Invalid truncate mode: ' + mode);
};

/**
 * Count truncate util
 * If count exceed the limit, it comes in the form of "MAX+"
 *
 * @param {number} count
 * @param {number} MAX default 99
 * @param {string} MAX_SUFFIX default +
 * @returns {string}
 * */
export const truncatedCount = (count: number, MAX = 99, MAX_SUFFIX = '+') => {
  if (count >= MAX) return `${MAX}${MAX_SUFFIX}`;
  return `${count}`;
};

/**
 * Messages date separator format
 *
 * @param {Date} date
 * @param {Locale} [locale]
 * @returns {string}
 * */
export const getDateSeparatorFormat = (date: Date, locale?: Locale): string => {
  if (isThisYear(date)) return format(date, 'MMM dd, yyyy', { locale });
  return format(date, 'E, MMM dd', { locale });
};

/**
 * Message time format
 *
 * @param {Date} date
 * @param {Locale} [locale]
 * @returns {string}
 * */
export const getMessageTimeFormat = (date: Date, locale?: Locale): string => {
  return format(date, 'p', { locale });
};

/**
 * Message preview title text
 * */
export const getMessagePreviewTitle = (message: SendbirdBaseMessage, EMPTY_USERNAME = '(No name)') => {
  if (message.isFileMessage() || message.isUserMessage()) {
    return message.sender.nickname || EMPTY_USERNAME;
  }
  if (message.isAdminMessage()) {
    return 'Admin';
  }
  return EMPTY_USERNAME;
};

/**
 * Message preview body text
 * */
export const getMessagePreviewBody = (message: SendbirdBaseMessage, EMPTY_MESSAGE = '') => {
  if (message.isFileMessage()) {
    const extIdx = message.name.lastIndexOf('.');
    if (extIdx > -1) {
      const file = message.name.slice(0, extIdx);
      const ext = message.name.slice(extIdx);
      return file + ext;
    }

    return message.name;
  }

  if (message.isUserMessage()) {
    return message.message ?? EMPTY_MESSAGE;
  }

  if (message.isAdminMessage()) {
    return message.message ?? EMPTY_MESSAGE;
  }

  return EMPTY_MESSAGE;
};

/**
 * Message preview time format
 * */
export const getMessagePreviewTime = (timestamp: number, locale?: Locale) => {
  if (isToday(timestamp)) return format(timestamp, 'p', { locale });
  if (isYesterday(timestamp)) return 'Yesterday';
  if (isThisYear(timestamp)) return format(timestamp, 'MMM dd', { locale });

  return format(timestamp, 'yyyy/MM/dd', { locale });
};

/**
 * milliseconds to 00:00 format
 * */
export const millsToMMSS = (mills: number) => {
  let seconds = Math.floor(Math.max(0, mills) / 1000);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${mm}:${ss}`;
};

/**
 * milliseconds to 0:00 format
 * */
export const millsToMSS = (mills: number) => {
  let seconds = Math.floor(Math.max(0, mills) / 1000);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  const ss = String(seconds).padStart(2, '0');

  return `${minutes}:${ss}`;
};
