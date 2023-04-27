import type { Locale } from 'date-fns';

import type { SendbirdGroupChannel } from '../types';
import { getMessagePreviewBody, getMessagePreviewTime } from './common';

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
  return getMessagePreviewTime(channel.lastMessage?.createdAt || channel.joinedAt * 1000 || channel.createdAt, locale);
};

export const getGroupChannelLastMessage = (channel: SendbirdGroupChannel, EMPTY_MESSAGE = '') => {
  const message = channel.lastMessage;
  if (!message) return EMPTY_MESSAGE;

  return getMessagePreviewBody(message, EMPTY_MESSAGE);
};
