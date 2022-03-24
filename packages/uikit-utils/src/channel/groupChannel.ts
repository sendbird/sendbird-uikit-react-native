import type Sendbird from 'sendbird';

export const groupChannelChatUnavailable = (channel: Sendbird.GroupChannel) => {
  return channel.myMutedState === 'muted' || (channel.isFrozen && channel.myRole !== 'operator');
};
