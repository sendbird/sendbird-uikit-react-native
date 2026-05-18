import { ApplicationAttributes, PremiumFeatures, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useAppFeatures = (sdk: SendbirdChatSDK) => {
  const { premiumFeatureList = [], applicationAttributes = [], uploadSizeLimit } = sdk.appInfo ?? {};
  return {
    deliveryReceiptEnabled: premiumFeatureList.includes(PremiumFeatures.delivery_receipt),
    broadcastChannelEnabled: premiumFeatureList.includes(PremiumFeatures.broadcast_channel),
    superGroupChannelEnabled: premiumFeatureList.includes(PremiumFeatures.super_group_channel),
    reactionEnabled: applicationAttributes.includes(ApplicationAttributes.reactions),
    uploadSizeLimit: uploadSizeLimit,
  };
};
