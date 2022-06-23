import React from 'react';

import type { GroupChannelSettingsFragment, GroupChannelSettingsModule } from '@sendbird/uikit-react-native-core';
import { createGroupChannelSettingsModule } from '@sendbird/uikit-react-native-core';
import { NOOP } from '@sendbird/uikit-utils';

const createGroupChannelSettingsFragment = (
  initModule?: Partial<GroupChannelSettingsModule>,
): GroupChannelSettingsFragment => {
  const GroupChannelSettingsModule = createGroupChannelSettingsModule(initModule);

  return ({ Header, onPressHeaderLeft = NOOP, staleChannel, onPressMenuMembers, onLeaveChannel, children }) => {
    return (
      <GroupChannelSettingsModule.Provider staleChannel={staleChannel}>
        <GroupChannelSettingsModule.Header Header={Header} onPressHeaderLeft={onPressHeaderLeft} />
        <GroupChannelSettingsModule.View onPressMenuMembers={onPressMenuMembers} onLeaveChannel={onLeaveChannel} />
        {children}
      </GroupChannelSettingsModule.Provider>
    );
  };
};

export default createGroupChannelSettingsFragment;
