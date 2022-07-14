import type { SendbirdBaseChannel, SendbirdGroupChannel } from '../types';

/**
 * Default sort comparator for channel
 * @param {SendbirdBaseChannel} a
 * @param {SendbirdBaseChannel} b
 * @returns {number}
 * */
export function channelComparator<T extends SendbirdBaseChannel>(a: T, b: T): number {
  if (a.isGroupChannel() && b.isGroupChannel()) {
    return (b.lastMessage?.createdAt ?? b.createdAt) - (a.lastMessage?.createdAt ?? a.createdAt);
  }
  return b.createdAt - a.createdAt;
}

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
