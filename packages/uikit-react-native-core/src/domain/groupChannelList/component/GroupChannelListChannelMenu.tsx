import React, { useContext, useEffect, useState } from 'react';

import { ActionMenu, useToast } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import { GroupChannelListContexts } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListChannelMenu: React.FC<GroupChannelListProps['ChannelMenu']> = () => {
  const channelMenu = useContext(GroupChannelListContexts.ChannelMenu);
  const { STRINGS } = useLocalization();
  const { currentUser } = useSendbirdChat();
  const toast = useToast();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (channelMenu.selectedChannel) setVisible(true);
  }, [channelMenu.selectedChannel]);

  const action = channelMenu.selectedChannel?.myPushTriggerOption === 'off' ? 'on' : 'off';

  return (
    <ActionMenu
      visible={visible}
      onHide={() => setVisible(false)}
      onDismiss={channelMenu.selectChannel}
      title={
        channelMenu.selectedChannel &&
        STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_TITLE(currentUser?.userId ?? '', channelMenu.selectedChannel)
      }
      menuItems={[
        {
          title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_NOTIFICATION(channelMenu.selectedChannel),
          onPress: async () => {
            if (action === 'on') {
              await channelMenu.selectedChannel?.setMyPushTriggerOption('default');
            } else {
              await channelMenu.selectedChannel?.setMyPushTriggerOption('off');
            }
          },
          onError: () => {
            const msg =
              action === 'on' ? STRINGS.TOAST.TURN_ON_NOTIFICATIONS_ERROR : STRINGS.TOAST.TURN_OFF_NOTIFICATIONS_ERROR;
            toast.show(msg, 'error');
          },
        },
        {
          title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_LEAVE,
          onPress: async () => {
            await channelMenu.selectedChannel?.leave();
          },
          onError: () => toast.show(STRINGS.TOAST.LEAVE_CHANNEL_ERROR, 'error'),
        },
      ]}
    />
  );
};

export default GroupChannelListChannelMenu;
