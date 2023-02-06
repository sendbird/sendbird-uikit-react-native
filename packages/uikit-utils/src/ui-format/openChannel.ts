import type { SendbirdOpenChannel } from '../types';

export const getOpenChannelTitle = (channel: SendbirdOpenChannel, DEFAULT_CHANNEL_NAME = 'Open Channel') => {
  const trimmedChannelName = channel.name.trim();
  if (trimmedChannelName === '') return DEFAULT_CHANNEL_NAME;
  return trimmedChannelName;
};

export const getOpenChannelParticipants = (channel: SendbirdOpenChannel) => {
  return `${channel.participantCount} participants`;
};
