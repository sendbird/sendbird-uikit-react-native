import type React from 'react';

import type { SendbirdMessage, SendbirdOpenChannel } from '@sendbird/uikit-utils';

import AdminMessage from './Message.admin';
import FileMessage from './Message.file';
import ImageFileMessage from './Message.file.image';
import VideoFileMessage from './Message.file.video';
import UnknownMessage from './Message.unknown';
import UserMessage from './Message.user';
import OpenGraphUserMessage from './Message.user.og';

export type OpenChannelMessageProps<T extends SendbirdMessage, AdditionalProps = unknown> = {
  channel: SendbirdOpenChannel;
  message: T;
  strings?: {
    senderName?: string;
    sentDate?: string;
    edited?: string;
    fileName?: string;
    unknownTitle?: string;
    unknownDescription?: string;
  };
  children?: React.ReactNode;
  grouped?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressAvatar?: () => void;
  onPressURL?: (url: string) => void;
} & AdditionalProps;

const OpenChannelMessage = {
  User: UserMessage,
  OpenGraphUser: OpenGraphUserMessage,
  File: FileMessage,
  ImageFile: ImageFileMessage,
  VideoFile: VideoFileMessage,
  Admin: AdminMessage,
  Unknown: UnknownMessage,
};

export default OpenChannelMessage;
