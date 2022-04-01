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

export const imageExtRegex = /jpeg|jpg|png|webp|gif/;
export const audioExtRegex = /3gp|aac|aax|act|aiff|flac|gsm|m4a|m4b|m4p|tta|wma|mp3|webm|wav/;
export const videoExtRegex = /mp4|avi/;
export const getFileType = (ext: string) => {
  if (ext.match(imageExtRegex)) return 'image';
  if (ext.match(audioExtRegex)) return 'audio';
  if (ext.match(videoExtRegex)) return 'video';
  return 'file';
};
export function getFileExtension(filePath: string) {
  const idx = filePath.lastIndexOf('.');
  return filePath.slice(idx - filePath.length).toLowerCase();
}
