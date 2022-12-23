import { BufferedRequest } from '../shared/bufferedRequest';
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

export const getGroupChannelChatAvailableState = (channel: SendbirdGroupChannel) => {
  const frozen = channel.isFrozen && channel.myRole !== 'operator';
  const muted = channel.myMutedState === 'muted';
  const disabled = frozen || muted;
  return { disabled, frozen, muted };
};

export const confirmAndMarkAsRead = async (channels: SendbirdBaseChannel[]) => {
  channels
    .filter((it): it is SendbirdGroupChannel => it.isGroupChannel() && it.unreadMessageCount > 0)
    .forEach((it) => BufferedRequest.markAsRead.push(() => it.markAsRead(), it.url));
};

export const confirmAndMarkAsDelivered = async (channels: SendbirdBaseChannel[]) => {
  channels
    .filter((it): it is SendbirdGroupChannel => it.isGroupChannel() && it.unreadMessageCount > 0)
    .forEach((it) => BufferedRequest.markAsDelivered.push(() => it.markAsDelivered(), it.url));
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

export function getChannelUniqId(channel: SendbirdChannel) {
  return channel.url;
}
