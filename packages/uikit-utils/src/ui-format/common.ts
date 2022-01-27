export const truncate = (str: string, maxLen = 40, separator = '...'): string => {
  if (str.length <= maxLen) return str;
  const lead = Math.ceil(maxLen / 2);
  const trail = Math.floor(maxLen / 2);
  return str.slice(0, lead) + separator + str.slice(-trail);
};
