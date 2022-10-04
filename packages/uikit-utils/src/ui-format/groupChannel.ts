import type { Locale } from 'date-fns';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';

import type { SendbirdGroupChannel } from '../types';
import { truncate } from './common';

export const getGroupChannelTitle = (
  currentUserId: string,
  channel: SendbirdGroupChannel,
  EMPTY_USERNAME = '(No name)',
  NO_MEMBERS = '(No members)',
  DEFAULT_CHANNEL_NAME = 'Group Channel',
) => {
  if (channel.name !== DEFAULT_CHANNEL_NAME && channel.name !== '') return channel.name;
  if (channel.memberCount === 1) return NO_MEMBERS;
  return channel.members
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => nickname || EMPTY_USERNAME)
    .join(', ');
};

export const getGroupChannelPreviewTime = (channel: SendbirdGroupChannel, locale?: Locale) => {
  const timestamp = channel.lastMessage?.createdAt || channel.joinedAt * 1000 || channel.createdAt;
  if (isToday(timestamp)) return format(timestamp, 'p', { locale });
  if (isYesterday(timestamp)) return 'Yesterday';
  return format(timestamp, 'MMM dd', { locale });
};

export const getGroupChannelLastMessage = (channel: SendbirdGroupChannel, EMPTY_MESSAGE = '', MAX_LEN = 15) => {
  const message = channel.lastMessage;
  if (!message) return EMPTY_MESSAGE;

  if (message.isFileMessage()) {
    const extIdx = message.name.lastIndexOf('.');
    if (extIdx > -1) {
      const file = message.name.slice(0, extIdx);
      const ext = message.name.slice(extIdx);
      return truncate(file, { maxLen: MAX_LEN }) + ext;
    }

    return truncate(message.name, { maxLen: MAX_LEN });
  }

  if (message.isUserMessage()) {
    return message.message ?? EMPTY_MESSAGE;
  }

  if (message.isAdminMessage()) {
    return message.message ?? EMPTY_MESSAGE;
  }

  return EMPTY_MESSAGE;
};
