import React from 'react';

import type { GroupChannelFragment, GroupChannelModule } from '@sendbird/uikit-react-native-core';
import { createGroupChannelModule } from '@sendbird/uikit-react-native-core';
import { EmptyFunction } from '@sendbird/uikit-utils';

const createGroupChannelFragment = (initModule?: GroupChannelModule): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({ Header, onPressHeaderLeft = EmptyFunction, channel, children }) => {
    // const { domainViewProps } = useGroupChannel();

    return (
      <GroupChannelModule.Provider channel={channel}>
        <GroupChannelModule.Header Header={Header} onPressHeaderLeft={onPressHeaderLeft} />
        <GroupChannelModule.View domainViewProp={'some-prop'} />
        {children}
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
