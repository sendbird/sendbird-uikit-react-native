import type { FilterByValueType } from './types';

export default function arrayToMap<T extends Record<K, unknown>, K extends keyof T = keyof T>(
  arr: T[],
  selector: K,
  fallbackSelector: K,
): Record<string, T>;

export default function arrayToMap<T extends Record<K, unknown>, K extends keyof T = keyof T>(
  arr: T[],
  selector: keyof FilterByValueType<T, string | number>,
): Record<string, T>;

export default function arrayToMap<T extends Record<K, unknown>, K extends keyof T = keyof T>(
  arr: T[],
  selector: K,
  fallbackSelector?: K,
) {
  return arr.reduce((accum, curr) => {
    const _key = (curr[selector] || curr[fallbackSelector as K]) as string;
    accum[_key] = curr;

    return accum;
  }, {} as Record<string, T>);
}
