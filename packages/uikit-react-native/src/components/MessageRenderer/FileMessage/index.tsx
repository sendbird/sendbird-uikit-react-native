import React from 'react';

import { SendbirdFileMessage, getFileExtension, getFileType } from '@sendbird/uikit-utils';

import type { MessageRendererInterface } from '../index';
import BaseFileMessage from './BaseFileMessage';
import ImageFileMessage from './ImageFileMessage';
import VideoFileMessage from './VideoFileMessage';

export type FileMessageProps = MessageRendererInterface<SendbirdFileMessage>;
const FileMessage = (props: FileMessageProps) => {
  const fileType = getFileType(props.message.type || getFileExtension(props.message.name));

  if (fileType === 'image') return <ImageFileMessage {...props} />;
  if (fileType === 'video') return <VideoFileMessage {...props} />;

  return <BaseFileMessage {...props} type={fileType} />;
};

export default React.memo(FileMessage);
