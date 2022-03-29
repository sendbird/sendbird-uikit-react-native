import React from 'react';

import type { GroupChannelInfoFragment, GroupChannelInfoModule } from '@sendbird/uikit-react-native-core';
import { createGroupChannelInfoModule } from '@sendbird/uikit-react-native-core';
import { EmptyFunction } from '@sendbird/uikit-utils';

const createGroupChannelInfoFragment = (initModule?: GroupChannelInfoModule): GroupChannelInfoFragment => {
  const GroupChannelInfoModule = createGroupChannelInfoModule(initModule);

  return ({
    Header,
    onPressHeaderLeft = EmptyFunction,
    staleChannel,
    onPressMenuMembers,
    onLeaveChannel,
    children,
  }) => {
    return (
      <GroupChannelInfoModule.Provider staleChannel={staleChannel}>
        <GroupChannelInfoModule.Header Header={Header} onPressHeaderLeft={onPressHeaderLeft} />
        <GroupChannelInfoModule.View onPressMenuMembers={onPressMenuMembers} onLeaveChannel={onLeaveChannel} />
        {children}
      </GroupChannelInfoModule.Provider>
    );
  };
};

export default createGroupChannelInfoFragment;
