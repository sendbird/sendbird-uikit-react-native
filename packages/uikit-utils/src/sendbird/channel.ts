import { BufferedRequest } from '../shared/bufferedRequest';
import type {
  SendbirdBaseChannel,
  SendbirdChannel,
  SendbirdGroupChannel,
  SendbirdGroupChannelCreateParams,
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

export const getGroupChannelChatAvailableState = (channel: SendbirdGroupChannel) => {
  const isOperator = channel.myRole === 'operator';
  const frozen = channel.isFrozen && !isOperator;
  const muted = channel.myMutedState === 'muted';
  const disabled = frozen || muted;
  return { disabled, frozen, muted };
};

export const getOpenChannelChatAvailableState = async (channel: SendbirdOpenChannel, userId: string) => {
  const isOperator = channel.isOperator(userId);
  const frozen = channel.isFrozen && !isOperator;
  const muted = (await channel.getMyMutedInfo()).isMuted;
  const disabled = frozen || muted;
  return { disabled, frozen, muted };
};

export const confirmAndMarkAsRead = (channels: SendbirdBaseChannel[], skipUnreadCountCheck?: boolean) => {
  channels
    .filter((it): it is SendbirdGroupChannel => {
      if (!it.isGroupChannel()) return false;
      return skipUnreadCountCheck ? true : it.unreadMessageCount > 0;
    })
    .forEach((it) => BufferedRequest.markAsRead.push(() => it.markAsRead(), it.url));
};

export const confirmAndMarkAsDelivered = (channels: SendbirdBaseChannel[]) => {
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

export function getDefaultGroupChannelCreateParams(params: {
  invitedUserIds: string[];
  currentUserId?: string;
}): SendbirdGroupChannelCreateParams {
  const createParams: SendbirdGroupChannelCreateParams = {
    name: '',
    coverUrl: '',
    isDistinct: false,
    invitedUserIds: params.invitedUserIds,
  };

  if (params.currentUserId) createParams.operatorUserIds = [params.currentUserId];

  return createParams;
}
