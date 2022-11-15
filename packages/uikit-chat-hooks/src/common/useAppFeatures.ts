import { ApplicationAttributes, PremiumFeatures, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useAppFeatures = (sdk: SendbirdChatSDK) => {
  const { premiumFeatureList = [], applicationAttributes = [] } = sdk.appInfo ?? {};
  return {
    deliveryReceiptEnabled: premiumFeatureList.includes(PremiumFeatures.delivery_receipt),
    broadcastChannelEnabled: applicationAttributes.includes(ApplicationAttributes.allow_broadcast_channel),
    superGroupChannelEnabled: applicationAttributes.includes(ApplicationAttributes.allow_super_group_channel),
    reactionEnabled: applicationAttributes.includes(ApplicationAttributes.reactions),
  };
};
