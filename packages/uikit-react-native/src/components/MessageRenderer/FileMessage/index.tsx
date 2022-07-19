import React from 'react';

import { SendbirdFileMessage, getFileExtension, getFileType } from '@sendbird/uikit-utils';

import type { MessageRendererInterface } from '../index';
import BaseFileMessage from './BaseFileMessage';
import ImageFileMessage from './ImageFileMessage';

export type FileMessageProps = MessageRendererInterface<SendbirdFileMessage>;
const FileMessage: React.FC<FileMessageProps> = (props) => {
  const fileType = getFileType(props.message.type || getFileExtension(props.message.name));

  if (fileType === 'image') return <ImageFileMessage {...props} />;
  return <BaseFileMessage {...props} type={fileType} />;
};

export default React.memo(FileMessage);
