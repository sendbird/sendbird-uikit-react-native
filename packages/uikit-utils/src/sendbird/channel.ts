import type Sendbird from 'sendbird';

/**
 * Default sort comparator for channel
 * @param {Sendbird.BaseChannel} a
 * @param {Sendbird.BaseChannel} b
 * @returns {number}
 * */
export function channelComparator<T extends Sendbird.BaseChannel>(a: T, b: T): number {
  if (a.isGroupChannel() && b.isGroupChannel()) {
    return (b.lastMessage?.createdAt ?? b.createdAt) - (a.lastMessage?.createdAt ?? a.createdAt);
  }
  return b.createdAt - a.createdAt;
}

/**
 * Diff utils for channel
 * @param {Sendbird.BaseChannel} [a]
 * @param {Sendbird.BaseChannel} [b]
 * @returns {boolean}
 * */
export function isDifferentChannel<T extends Sendbird.BaseChannel>(a?: T, b?: T): boolean {
  if (!a || !b) return true;
  return a.url !== b.url;
}

export const groupChannelChatUnavailable = (channel: Sendbird.GroupChannel) => {
  return channel.myMutedState === 'muted' || (channel.isFrozen && channel.myRole !== 'operator');
};

export function isDefaultCoverImage(coverUrl: string) {
  return coverUrl === '' || coverUrl.startsWith('https://static.sendbird.com/sample/cover');
}

export function getMembersExcludeMe(channel: Sendbird.GroupChannel, currentUserId?: string) {
  return channel.members.filter((m) => m.userId !== currentUserId);
}
