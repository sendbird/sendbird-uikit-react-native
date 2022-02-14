type TruncateMode = 'head' | 'mid' | 'tail';
type TruncateOption = { mode: TruncateMode; maxLen: number; separator: string };
const defaultOpts: TruncateOption = { mode: 'mid', maxLen: 40, separator: '...' };

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

export const truncatedBadgeCount = (count: number, MAX = 99) => {
  if (count >= MAX) return `${MAX}+`;
  return `${count}`;
};
