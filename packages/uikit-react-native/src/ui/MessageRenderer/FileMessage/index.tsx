import React from 'react';
import type Sendbird from 'sendbird';

import { getFileExtension, getFileType } from '@sendbird/uikit-utils';

import type { MessageRendererInterface } from '../index';
import BaseFileMessage from './BaseFileMessage';
import ImageFileMessage from './ImageFileMessage';

export type FileMessageProps = MessageRendererInterface<Sendbird.FileMessage>;
const FileMessage: React.FC<FileMessageProps> = (props) => {
  const ext = getFileExtension(props.message.name);
  const fileType = getFileType(ext);

  if (fileType === 'image') return <ImageFileMessage {...props} />;
  return <BaseFileMessage {...props} type={fileType} />;
};

export default FileMessage;
