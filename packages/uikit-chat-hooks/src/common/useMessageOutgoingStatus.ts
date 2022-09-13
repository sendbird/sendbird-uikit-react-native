import type {
  SendbirdAdminMessage,
  SendbirdChatSDK,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';
import { isDifferentChannel, isMyMessage, useForceUpdate, useUniqId } from '@sendbird/uikit-utils';

import { useChannelHandler } from '../handler/useChannelHandler';
import { useAppFeatures } from './useAppFeatures';

const HOOK_NAME = 'useMessageOutgoingStatus';

export type SBUOutgoingStatus = 'NONE' | 'PENDING' | 'FAILED' | 'UNDELIVERED' | 'DELIVERED' | 'UNREAD' | 'READ';

export const useMessageOutgoingStatus = (
  sdk: SendbirdChatSDK,
  channel: SendbirdGroupChannel,
  message?: SendbirdFileMessage | SendbirdUserMessage | SendbirdAdminMessage | null,
): SBUOutgoingStatus => {
  const features = useAppFeatures(sdk);
  const forceUpdate = useForceUpdate();
  const currentUser = sdk.currentUser;

  const uniqId = useUniqId(HOOK_NAME);
  useChannelHandler(sdk, `${HOOK_NAME}_${uniqId}`, {
    onDeliveryReceiptUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!isMyMessage(message, currentUser?.userId)) return;

      forceUpdate();
    },
    onReadReceiptUpdated(eventChannel) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (!isMyMessage(message, currentUser?.userId)) return;

      forceUpdate();
    },
  });

  if (!message) return 'NONE';

  if (message.sendingStatus === 'pending') return 'PENDING';

  if (message.sendingStatus === 'failed') return 'FAILED';

  if (channel.getUnreadMemberCount(message) === 0) return 'READ';

  if (features.deliveryReceiptEnabled) {
    if (channel.getUndeliveredMemberCount(message) === 0) return 'DELIVERED';
    return 'UNDELIVERED';
  }

  return 'UNREAD';
};
