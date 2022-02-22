import React, { useContext } from 'react';

import { Dialogue } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListChannelMenu: React.FC<GroupChannelListProps['ChannelMenu']> = () => {
  const channelMenu = useContext(GroupChannelListContext.ChannelMenu);
  const { LABEL } = useLocalization();
  const { currentUser } = useSendbirdChat();

  return (
    <Dialogue
      visible={Boolean(channelMenu.selectedChannel)}
      onHide={channelMenu.selectChannel}
      title={
        channelMenu.selectedChannel &&
        LABEL.GROUP_CHANNEL_LIST.CHANNEL_MENU.TITLE(currentUser?.userId ?? '', channelMenu.selectedChannel)
      }
      items={[
        {
          title: LABEL.GROUP_CHANNEL_LIST.CHANNEL_MENU.MENU_NOTIFICATIONS(channelMenu.selectedChannel),
          onPress: async () => {
            if (channelMenu.selectedChannel?.myPushTriggerOption === 'off') {
              await channelMenu.selectedChannel?.setMyPushTriggerOption('default');
            } else {
              await channelMenu.selectedChannel?.setMyPushTriggerOption('off');
            }
          },
        },
        {
          title: LABEL.GROUP_CHANNEL_LIST.CHANNEL_MENU.MENU_LEAVE_CHANNEL,
          onPress: async () => {
            await channelMenu.selectedChannel?.leave();
          },
        },
      ]}
    />
  );
};

export default GroupChannelListChannelMenu;
