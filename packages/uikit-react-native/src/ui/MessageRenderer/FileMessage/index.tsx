import React from 'react';
import type Sendbird from 'sendbird';

import type { MessageRendererInterface } from '../index';
import BaseFileMessage from './BaseFileMessage';
import ImageFileMessage from './ImageFileMessage';

function getFileExtension(filePath: string) {
  const idx = filePath.lastIndexOf('.');
  return filePath.slice(idx - filePath.length).toLowerCase();
}

const imageRegex = /jpeg|jpg|png|webp|gif/;
const audioRegex = /3gp|aa|aac|aax|act|aiff|alac|amr|ape|au|awb|dss|dvf|flac|gsm|m4a|m4b|m4p|tta|wma|mp3|webm|wav/;
const videoRegex = /mp4|avi/;

const getFileType = (ext: string) => {
  if (ext.match(imageRegex)) return 'image';
  if (ext.match(audioRegex)) return 'audio';
  if (ext.match(videoRegex)) return 'video';
  return 'file';
};

export type FileMessageProps = MessageRendererInterface<Sendbird.FileMessage>;
const FileMessage: React.FC<FileMessageProps> = (props) => {
  const ext = getFileExtension(props.message.name);
  const fileType = getFileType(ext);

  if (fileType === 'image') return <ImageFileMessage {...props} />;
  return <BaseFileMessage {...props} type={fileType} />;
};

export default FileMessage;
