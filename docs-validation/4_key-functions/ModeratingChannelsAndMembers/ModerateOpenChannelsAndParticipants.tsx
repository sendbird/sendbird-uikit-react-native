const MyHeader = () => null;

/**
 *
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/moderating-channels-and-members/moderate-group-channels-and-members}
 * */
import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelModerationFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const OpenChannelModerationFragment = createOpenChannelModerationFragment();
const OpenChannelModerationScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToOpenChannelOperatorsScreen = () => {};
  const navigateToOpenChannelMutedParticipantsScreen = () => {};
  const navigateToOpenChannelBannedUsersScreen = () => {};
  const navigateToBack = () => {};

  return (
    <OpenChannelModerationFragment
      channel={channel}
      onPressMenuOperators={navigateToOpenChannelOperatorsScreen}
      onPressMenuMutedParticipants={navigateToOpenChannelMutedParticipantsScreen}
      onPressMenuBannedUsers={navigateToOpenChannelBannedUsersScreen}
      onPressHeaderLeft={navigateToBack}
    />
  );
};

/**
 *
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/moderating-channels-and-members/moderate-group-channels-and-members}
 * */
const OpenChannelModerationFragment2 = createOpenChannelModerationFragment({
  Header: () => <MyHeader />, // Use custom header
});
const OpenChannelModerationScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToOpenChannelOperatorsScreen = () => {};
  const navigateToOpenChannelMutedParticipantsScreen = () => {};
  const navigateToOpenChannelBannedUsersScreen = () => {};
  const navigateToBack = () => {};

  return (
      <OpenChannelModerationFragment
          channel={channel}
          onPressHeaderLeft={navigateToBack}
          onPressMenuOperators={navigateToOpenChannelOperatorsScreen}
          onPressMenuMutedParticipants={navigateToOpenChannelMutedParticipantsScreen}
          onPressMenuBannedUsers={navigateToOpenChannelBannedUsersScreen}
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

