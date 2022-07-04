import { useMemo } from 'react';

import { ApplicationAttributes, PremiumFeatures, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useAppFeatures = (sdk: SendbirdChatSDK) => {
  const deliveryReceiptEnabled = useMemo(() => {
    return Boolean(sdk.appInfo?.premiumFeatureList?.includes?.(PremiumFeatures.delivery_receipt));
  }, [sdk]);

  const broadcastChannelEnabled = useMemo(() => {
    return Boolean(sdk.appInfo?.applicationAttributes?.includes?.(ApplicationAttributes.allow_broadcast_channel));
  }, [sdk]);

  const superGroupChannelEnabled = useMemo(() => {
    return Boolean(sdk.appInfo?.applicationAttributes?.includes?.(ApplicationAttributes.allow_super_group_channel));
  }, [sdk]);

  const reactionEnabled = useMemo(() => {
    return Boolean(sdk.appInfo?.applicationAttributes?.includes?.(ApplicationAttributes.reactions));
  }, [sdk]);

  return {
    deliveryReceiptEnabled,
    broadcastChannelEnabled,
    superGroupChannelEnabled,
    reactionEnabled,
  };
};
