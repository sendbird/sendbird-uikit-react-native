import { useCallback, useState } from 'react';

import { PushTriggerOption } from '@sendbird/chat';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger, useAsyncEffect } from '@sendbird/uikit-utils';

const PushTriggerMap = {
  'all': PushTriggerOption.ALL,
  'mention_only': PushTriggerOption.MENTION_ONLY,
  'off': PushTriggerOption.OFF,
  'default': PushTriggerOption.DEFAULT,
};

export const usePushTrigger = (sdk: SendbirdChatSDK) => {
  const [option, setOption] = useState<PushTriggerOption>(PushTriggerOption.DEFAULT);

  const updateOption = useCallback(
    async (value: keyof typeof PushTriggerMap) => {
      try {
        const _option = PushTriggerMap[value];
        await sdk.setPushTriggerOption(_option).then(() => setOption(_option));
      } catch (e) {
        Logger.warn('[usePushTrigger]', 'Cannot update push trigger option', e);
      }
    },
    [sdk, sdk.currentUser],
  );

  useAsyncEffect(async () => {
    setOption(await sdk.getPushTriggerOption());
  }, [sdk, sdk.currentUser]);

  return {
    option,
    updateOption,
  };
};
