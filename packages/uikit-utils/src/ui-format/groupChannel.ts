import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import type Sendbird from 'sendbird';

import { truncate } from './common';

export const getGroupChannelTitle = (
  currentUserId: string,
  channel: Sendbird.GroupChannel,
  EMPTY_USERNAME = 'User',
  DEFAULT_CHANNEL_NAME = 'Group Channel',
) => {
  if (channel.name !== DEFAULT_CHANNEL_NAME && channel.name !== '') return channel.name;
  if (channel.memberCount === 1) return DEFAULT_CHANNEL_NAME;
  return channel.members
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => nickname || EMPTY_USERNAME)
    .join(', ');
};

export const getGroupChannelPreviewTime = (channel: Sendbird.GroupChannel) => {
  const timestamp = channel.lastMessage?.createdAt || channel.joinedAt || channel.createdAt;
  if (isToday(timestamp)) return format(timestamp, 'p');
  if (isYesterday(timestamp)) return 'Yesterday';
  return format(timestamp, 'MMM dd');
};

export const getGroupChannelLastMessage = (channel: Sendbird.GroupChannel, EMPTY_MESSAGE = '') => {
  const message = channel.lastMessage;
  if (!message) return EMPTY_MESSAGE;

  if (message.isFileMessage()) {
    const extensionIndex = message.name.lastIndexOf('.');
    if (extensionIndex > -1) {
      const file = message.name.slice(0, extensionIndex);
      const ext = message.name.slice(extensionIndex);
      return truncate(file) + ext;
    }

    return truncate(message.name, 15);
  }

  return message.message ?? EMPTY_MESSAGE;
};
