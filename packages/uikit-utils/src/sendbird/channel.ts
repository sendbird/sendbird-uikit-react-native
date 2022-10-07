import type {
  SendbirdBaseChannel,
  SendbirdChannel,
  SendbirdChatSDK,
  SendbirdGroupChannel,
  SendbirdOpenChannel,
} from '../types';

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

export const isGroupChannelChatUnavailable = (channel: SendbirdGroupChannel) => {
  return channel.myMutedState === 'muted' || (channel.isFrozen && channel.myRole !== 'operator');
};

export const confirmAndMarkAsRead = async (sdk: SendbirdChatSDK, channels: SendbirdBaseChannel[]) => {
  const channelUrls = channels.filter((it) => it.isGroupChannel() && it.unreadMessageCount > 0).map((it) => it.url);
  await sdk.groupChannel.markAsReadWithChannelUrls(channelUrls);
};

export const confirmAndMarkAsDelivered = async (sdk: SendbirdChatSDK, channel: SendbirdBaseChannel) => {
  if (channel.isGroupChannel() && channel.unreadMessageCount > 0) {
    await sdk.groupChannel.markAsDelivered(channel.url);
  }
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
