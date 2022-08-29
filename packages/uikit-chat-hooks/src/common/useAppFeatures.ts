import { ApplicationAttributes, PremiumFeatures, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useAppFeatures = (sdk: SendbirdChatSDK) => {
  const { premiumFeatureList = [], applicationAttributes = [] } = sdk.appInfo ?? {};
  return {
    deliveryReceiptEnabled: Boolean(premiumFeatureList.includes(PremiumFeatures.delivery_receipt)),
    broadcastChannelEnabled: Boolean(applicationAttributes.includes(ApplicationAttributes.allow_broadcast_channel)),
    superGroupChannelEnabled: Boolean(applicationAttributes.includes(ApplicationAttributes.allow_super_group_channel)),
    reactionEnabled: Boolean(applicationAttributes.includes(ApplicationAttributes.reactions)),
  };
};
