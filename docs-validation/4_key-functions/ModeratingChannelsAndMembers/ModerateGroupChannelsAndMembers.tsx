/**
 *
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/moderating-channels-and-members/moderate-group-channels-and-members}
 * */
import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelModerationFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const GroupChannelModerationFragment = createGroupChannelModerationFragment();
const GroupChannelModerationScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelOperatorsScreen = () => {};
  const navigateToGroupChannelMutedMembersScreen = () => {};
  const navigateToGroupChannelBannedUsersScreen = () => {};
  const navigateToBack = () => {};

  return (
    <GroupChannelModerationFragment
      channel={channel}
      onPressMenuOperators={navigateToGroupChannelOperatorsScreen}
      onPressMenuMutedMembers={navigateToGroupChannelMutedMembersScreen}
      onPressMenuBannedUsers={navigateToGroupChannelBannedUsersScreen}
      onPressHeaderLeft={navigateToBack}
    />
  );
};

/**
 *
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/moderating-channels-and-members/moderate-group-channels-and-members}
 * */
import { Text } from 'react-native';

const GroupChannelModerationFragment2 = createGroupChannelModerationFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  Menu: () => <Text>{'Custom Menu'}</Text>,
});
const GroupChannelModerationScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelOperatorsScreen = () => {};
  const navigateToGroupChannelMutedMembersScreen = () => {};
  const navigateToGroupChannelBannedUsersScreen = () => {};
  const navigateToBack = () => {};

  return (
    <GroupChannelModerationFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuOperators={navigateToGroupChannelOperatorsScreen}
      onPressMenuMutedMembers={navigateToGroupChannelMutedMembersScreen}
      onPressMenuBannedUsers={navigateToGroupChannelBannedUsersScreen}
      menuItemsCreator={(items) => {
        // Add custom menu
        items.push({
          icon: 'edit',
          name: 'Edit',
          onPress: () => console.log('clicked'),
        });

        return items;
      }}
    />
  );
};
