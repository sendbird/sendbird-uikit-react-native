import type React from 'react';

import type { SendbirdGroupChannel, SendbirdMessage, SendbirdUser } from '@sendbird/uikit-utils';

import AdminMessage from './Message.admin';
import FileMessage from './Message.file';
import ImageFileMessage from './Message.file.image';
import VideoFileMessage from './Message.file.video';
import UnknownMessage from './Message.unknown';
import UserMessage from './Message.user';
import OpenGraphUser from './Message.user.og';

export type GroupChannelMessageProps<T extends SendbirdMessage, AdditionalProps = unknown> = {
  channel: SendbirdGroupChannel;
  message: T;
  variant?: 'outgoing' | 'incoming';
  strings?: {
    senderName?: string;
    sentDate?: string;
    edited?: string;
    fileName?: string;
    unknownTitle?: string;
    unknownDescription?: string;
  };

  children?: React.ReactNode;
  sendingStatus?: React.ReactNode;

  groupedWithPrev: boolean;
  groupedWithNext: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressAvatar?: () => void;
  onPressURL?: (url: string) => void;
  onPressMentionedUser?: (mentionedUser?: SendbirdUser) => void;
} & AdditionalProps;

const GroupChannelMessage = {
  User: UserMessage,
  OpenGraphUser: OpenGraphUser,
  File: FileMessage,
  ImageFile: ImageFileMessage,
  VideoFile: VideoFileMessage,
  Admin: AdminMessage,
  Unknown: UnknownMessage,
};

export default GroupChannelMessage;
