const replace = (original: string, start: number, end: number, str: string) => {
  return original.slice(0, start) + str + original.slice(end);
};

export default replace;
