import { renderHook } from '@testing-library/react-native';

import { useAppFeatures } from '@sendbird/uikit-chat-hooks';
import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';
import { ApplicationAttributes, PremiumFeatures } from '@sendbird/uikit-utils';

describe('useAppFeatures', () => {
  it('should return app features', () => {
    const sdk = createMockSendbirdChat({
      appInfo: {
        premiumFeatureList: [PremiumFeatures.delivery_receipt],
        applicationAttributes: [
          ApplicationAttributes.allow_broadcast_channel,
          ApplicationAttributes.allow_super_group_channel,
          ApplicationAttributes.reactions,
        ],
      },
    });
    const { result } = renderHook(() => useAppFeatures(sdk));

    expect(result.current.deliveryReceiptEnabled).toBe(true);
    expect(result.current.broadcastChannelEnabled).toBe(true);
    expect(result.current.superGroupChannelEnabled).toBe(true);
    expect(result.current.reactionEnabled).toBe(true);
  });

  it('should handle missing app info', () => {
    const sdk = createMockSendbirdChat({
      appInfo: {
        premiumFeatureList: [],
        applicationAttributes: [],
      },
    });

    const { result } = renderHook(() => useAppFeatures(sdk));

    expect(result.current.deliveryReceiptEnabled).toBe(false);
    expect(result.current.broadcastChannelEnabled).toBe(false);
    expect(result.current.superGroupChannelEnabled).toBe(false);
    expect(result.current.reactionEnabled).toBe(false);
  });

  it('should handle empty app info', () => {
    const sdk = { appInfo: {} } as never;

    const { result } = renderHook(() => useAppFeatures(sdk));

    expect(result.current.deliveryReceiptEnabled).toBe(false);
    expect(result.current.broadcastChannelEnabled).toBe(false);
    expect(result.current.superGroupChannelEnabled).toBe(false);
    expect(result.current.reactionEnabled).toBe(false);
  });
});
