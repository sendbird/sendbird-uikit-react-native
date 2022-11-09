const MyHeader = () => null;

/**
 *
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/moderating-channels-and-members/moderate-group-channels-and-members}
 * */
import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelModerationsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const GroupChannelModerationsFragment = createGroupChannelModerationsFragment();
const GroupChannelModerationsScreen = ({ params }: { params: { channelUrl: string } }) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelOperatorsScreen = () => {};
  const navigateToGroupChannelMutedMembersScreen = () => {};
  const navigateToGroupChannelBannedUsersScreen = () => {};
  const navigateToBack = () => {};

  return (
    <GroupChannelModerationsFragment
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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/moderating-channels-and-members/moderate-group-channels-and-members}
 * */
const GroupChannelModerationsFragment2 = createGroupChannelModerationsFragment({
  Header: () => <MyHeader />, // Use custom header
});
const GroupChannelModerationsScreen2 = ({ params }: { params: { channelUrl: string } }) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelOperatorsScreen = () => {};
  const navigateToGroupChannelMutedMembersScreen = () => {};
  const navigateToGroupChannelBannedUsersScreen = () => {};
  const navigateToBack = () => {};

  return (
      <GroupChannelModerationsFragment
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

