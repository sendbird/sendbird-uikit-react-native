// For iOS 12 backwards compatibility
require('string.prototype.matchall').shim();

export const urlRegexStrict =
  /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_+[\],.~#?&/=]*[-a-zA-Z0-9@:%_+\]~#?&/=])*/g;
export const urlRegexRough =
  /(https?:\/\/|www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
export const phoneRegex = /[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}/;
export const emailRegex = /\S+@\S+\.\S+/;
export const newLineRegex = /\r\n|\r|\n/g;

// const cases = [
//   {
//     type: 'urlStrict',
//     regex: urlRegexStrict,
//   },
//   {
//     type: 'urlRough',
//     regex: urlRegexStrict,
//   },
//   {
//     type: 'email',
//     regex: emailRegex,
//   },
//   {
//     type: 'phone',
//     regex: urlRegexStrict,
//   },
// ];

export const replaceUrlAsComponents = <T>(originText: string, replacer: (url: string) => T, strict?: boolean) => {
  const matches = [...originText.matchAll(strict ? urlRegexStrict : urlRegexRough)];
  const founds = matches.map((value) => {
    const text = value[0];
    const start = value.index ?? 0;
    const end = start + text.length;
    return { text, start, end };
  });

  const items: Array<string | T> = [originText];
  let cursor = 0;
  founds.forEach(({ text, start, end }) => {
    const restText = items.pop() as string;
    const head = restText.slice(0, start - cursor);
    const mid = replacer(text);
    const tail = restText.slice(end - cursor);
    items.push(head, mid, tail);
    cursor = end;
  });
  return items;
};

export const imageExtRegex = /jpeg|jpg|png|webp|gif/i;
export const audioExtRegex = /3gp|aac|aax|act|aiff|flac|gsm|m4a|m4b|m4p|tta|wma|mp3|webm|wav/i;
export const videoExtRegex = /mp4|avi/i;
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
