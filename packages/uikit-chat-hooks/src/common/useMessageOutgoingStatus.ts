import type { SendbirdChatSDK, SendbirdGroupChannel, SendbirdMessage } from '@sendbird/uikit-utils';
import { isDifferentChannel, isMyMessage, useForceUpdate, useUniqId } from '@sendbird/uikit-utils';

import { useChannelHandler } from '../handler/useChannelHandler';
import { useAppFeatures } from './useAppFeatures';

const HOOK_NAME = 'useMessageOutgoingStatus';

export type SBUOutgoingStatus = 'NONE' | 'PENDING' | 'FAILED' | 'UNDELIVERED' | 'DELIVERED' | 'UNREAD' | 'READ';

export const useMessageOutgoingStatus = (
  sdk: SendbirdChatSDK,
  channel: SendbirdGroupChannel,
  message?: SendbirdMessage | null,
): SBUOutgoingStatus => {
  const features = useAppFeatures(sdk);
  const forceUpdate = useForceUpdate();
  const currentUser = sdk.currentUser;

  const uniqId = useUniqId(HOOK_NAME);
  useChannelHandler(sdk, `${HOOK_NAME}_${uniqId}`, {
    onUndeliveredMemberStatusUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!isMyMessage(message, currentUser?.userId)) return;

      forceUpdate();
    },
    onUnreadMemberStatusUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!isMyMessage(message, currentUser?.userId)) return;

      forceUpdate();
    },
  });

  if (!message) return 'NONE';

  if ('sendingStatus' in message) {
    if (message.sendingStatus === 'pending') return 'PENDING';
    if (message.sendingStatus === 'failed') return 'FAILED';
  }

  if (channel.isBroadcast || channel.isSuper) return 'NONE';

  if (channel.getUnreadMemberCount(message) === 0) return 'READ';

  if (features.deliveryReceiptEnabled) {
    if (channel.getUndeliveredMemberCount(message) === 0) return 'DELIVERED';
    return 'UNDELIVERED';
  }

  return 'UNREAD';
};
