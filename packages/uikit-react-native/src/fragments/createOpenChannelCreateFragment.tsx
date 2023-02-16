import React, { useState } from 'react';

import { NOOP, PASS, SendbirdOpenChannelCreateParams } from '@sendbird/uikit-utils';

import { createOpenChannelCreateModule } from '../domain/openChannelCreate';
import type { OpenChannelCreateFragment, OpenChannelCreateModule } from '../domain/openChannelCreate/types';
import { useSendbirdChat } from '../hooks/useContext';
import type { FileType } from '../platform/types';

const createOpenChannelCreateFragment = (initModule?: Partial<OpenChannelCreateModule>): OpenChannelCreateFragment => {
  const OpenChannelCreateModule = createOpenChannelCreateModule(initModule);

  return ({ onPressHeaderLeft = NOOP, onBeforeCreateChannel = PASS, onCreateChannel }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const [channelName, setChannelName] = useState('');
    const [channelCoverFile, setChannelCoverFile] = useState<FileType | undefined>(undefined);

    const shouldActivateHeaderRight = () => {
      return Boolean(currentUser) && channelName.trim() !== '';
    };

    const onPressHeaderRight = async () => {
      if (currentUser) {
        const params: SendbirdOpenChannelCreateParams = {
          name: channelName,
          operatorUserIds: [currentUser.userId],
        };

        if (channelCoverFile) params.coverUrlOrImage = channelCoverFile;

        const processedParams = await onBeforeCreateChannel(params);
        const channel = await sdk.openChannel.createChannel(processedParams);
        onCreateChannel(channel);
      }
    };

    return (
      <OpenChannelCreateModule.Provider>
        <OpenChannelCreateModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
          shouldActivateHeaderRight={shouldActivateHeaderRight}
        />
        <OpenChannelCreateModule.ProfileInput
          channelName={channelName}
          onChangeChannelName={setChannelName}
          channelCoverFile={channelCoverFile}
          onChangeChannelCoverFile={setChannelCoverFile}
        />
      </OpenChannelCreateModule.Provider>
    );
  };
};

export default createOpenChannelCreateFragment;
