import type { SendbirdBaseChannel, SendbirdChannel, SendbirdGroupChannel, SendbirdOpenChannel } from '../types';

/**
 * Diff utils for channel
 * @param {SendbirdBaseChannel} [a]
 * @param {SendbirdBaseChannel} [b]
 * @returns {boolean}
 * */
export function isDifferentChannel<T extends SendbirdBaseChannel>(a?: T, b?: T): boolean {
  if (!a || !b) return true;
  return a.url !== b.url;
}

export const groupChannelChatUnavailable = (channel: SendbirdGroupChannel) => {
  return channel.myMutedState === 'muted' || (channel.isFrozen && channel.myRole !== 'operator');
};

export function isDefaultCoverImage(coverUrl: string) {
  return coverUrl === '' || coverUrl.startsWith('https://static.sendbird.com/sample/cover');
}

export function getMembersExcludeMe(channel: SendbirdGroupChannel, currentUserId?: string) {
  return channel.members.filter((m) => m.userId !== currentUserId);
}

export function getGroupChannels(channels: SendbirdChannel[]): SendbirdGroupChannel[] {
  return channels.filter((c): c is SendbirdGroupChannel => c.isGroupChannel());
}

export function getOpenChannels(channels: SendbirdChannel[]): SendbirdOpenChannel[] {
  return channels.filter((c): c is SendbirdOpenChannel => c.isOpenChannel());
}
