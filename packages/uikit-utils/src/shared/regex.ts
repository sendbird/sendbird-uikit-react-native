export const urlRegex =
  /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#()?&/=]*)/g;
export const newLineRegex = /\r\n|\r|\n/g;

export const replaceUrlAsComponents = <T>(originText: string, replacer: (url: string) => T) => {
  const matches = [...originText.matchAll(urlRegex)];
  const founds = matches.map((value) => {
    const text = value[0];
    const pos = value.index ?? 0;
    const end = pos + text.length;
    return { text, pos, end };
  });

  const items: Array<string | T> = [originText];
  founds.forEach(({ text, pos, end }) => {
    const restText = items.pop() as string;
    const head = restText.slice(0, pos);
    const mid = replacer(text);
    const tail = restText.slice(end);
    items.push(head, mid, tail);
  });
  return items;
};
