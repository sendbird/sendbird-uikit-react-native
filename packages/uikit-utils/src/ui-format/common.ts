import type { Locale } from 'date-fns';
import format from 'date-fns/format';

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
export const dateSeparator = (date: Date, locale?: Locale): string => {
  return format(date, 'E, LLL dd', { locale });
};

/**
 * Message time format
 *
 * @param {Date} date
 * @param {Locale} [locale]
 * @returns {string}
 * */
export const messageTime = (date: Date, locale?: Locale): string => {
  return format(date, 'p', { locale });
};
