import { useCallback, useState } from 'react';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger, useAsyncEffect } from '@sendbird/uikit-utils';

type PushTriggerOptionType = 'all' | 'mention_only' | 'off';
export const usePushTrigger = (sdk: SendbirdChatSDK) => {
  const [option, setOption] = useState<PushTriggerOptionType>('off');

  const updateOption = useCallback(
    async (value: PushTriggerOptionType) => {
      try {
        await sdk.setPushTriggerOption(value);
        setOption(value);
      } catch (e) {
        Logger.warn('[usePushTrigger]', 'Cannot update push trigger option', e);
      }
    },
    [sdk, sdk.currentUser],
  );

  useAsyncEffect(async () => {
    const currentOption = await sdk.getPushTriggerOption();
    setOption(currentOption as PushTriggerOptionType);
  }, [sdk, sdk.currentUser]);

  return {
    option,
    updateOption,
  };
};
