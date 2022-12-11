import React from 'react';

import { NOOP } from '@sendbird/uikit-utils';

import { createGroupChannelNotificationsModule } from '../domain/groupChannelNotifications';
import type {
  GroupChannelNotificationsFragment,
  GroupChannelNotificationsModule,
} from '../domain/groupChannelNotifications/types';

const createGroupChannelNotificationsFragment = (
  initModule?: Partial<GroupChannelNotificationsModule>,
): GroupChannelNotificationsFragment => {
  const GroupChannelNotificationsModule = createGroupChannelNotificationsModule(initModule);

  return ({ onPressHeaderLeft = NOOP, children, channel }) => {
    return (
      <GroupChannelNotificationsModule.Provider channel={channel}>
        <GroupChannelNotificationsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <GroupChannelNotificationsModule.View />
        {children}
      </GroupChannelNotificationsModule.Provider>
    );
  };
};

export default createGroupChannelNotificationsFragment;
