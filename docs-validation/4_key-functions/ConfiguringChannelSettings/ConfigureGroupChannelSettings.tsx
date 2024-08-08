import type { GroupChannelSettingsContextsType } from '@sendbird/uikit-react-native';

/**
 * Usage
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-usage}
 * */
import React, { useState } from 'react';
import { useSendbirdChat, createGroupChannelSettingsFragment } from '@sendbird/uikit-react-native';
import { useGroupChannel } from "@sendbird/uikit-chat-hooks";

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelMembersScreen = () => {};
  const navigateToGroupChannelModerationScreen = () => {};

  // Only required when you enabled mention.
  const navigateToGroupChannelNotificationScreen = () => {};

  // Only required when you enabled message search.
  const navigateToMessageSearchScreen = () => {};

  return (
    <GroupChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuLeaveChannel={navigateToGroupChannelListScreen}
      onPressMenuMembers={navigateToGroupChannelMembersScreen}
      onPressMenuModeration={navigateToGroupChannelModerationScreen}
      onPressMenuNotification={navigateToGroupChannelNotificationScreen}
      onPressMenuSearchInChannel={navigateToMessageSearchScreen}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-context}
 * */
function _context(_: GroupChannelSettingsContextsType) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle;
  fragment.headerRight;
  fragment.channel;
  fragment.onPressHeaderRight;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-context-3-fragment}
 * */
import { useContext } from 'react';
import { GroupChannelSettingsContexts } from '@sendbird/uikit-react-native';

const Component = () => {
  const { channel, headerTitle, headerRight, onPressHeaderRight } = useContext(GroupChannelSettingsContexts.Fragment);
}
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-customization}
 * */
import { Text, Share } from 'react-native';

import { Icon } from '@sendbird/uikit-react-native-foundation';
// import { useGroupChannel } from "@sendbird/uikit-chat-hooks";

const GroupChannelSettingsFragment2 = createGroupChannelSettingsFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  Menu: () => <Text>{'Custom Menu'}</Text>,
  Info: () => <Text>{'Custom Info'}</Text>,
});
const GroupChannelSettingsScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelMembersScreen = () => {};
  const navigateToGroupChannelModerationScreen = () => {};

  // Only required when you enabled mention.
  const navigateToGroupChannelNotificationScreen = () => {};

  // Only required when you enabled message search.
  const navigateToMessageSearchScreen = () => {};

  return (
    <GroupChannelSettingsFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuLeaveChannel={navigateToGroupChannelListScreen}
      onPressMenuMembers={navigateToGroupChannelMembersScreen}
      onPressMenuModeration={navigateToGroupChannelModerationScreen}
      onPressMenuNotification={navigateToGroupChannelNotificationScreen}
      onPressMenuSearchInChannel={navigateToMessageSearchScreen}
      menuItemsCreator={(items) => {
        items.unshift({
          icon: 'channels',
          name: 'Share channel',
          actionItem: <Icon icon={'chevron-right'} color={'black'} />,
          onPress: () => Share.share({ title: 'Channel url', url: channel.url }),
        });
        return items;
      }}
    />
  );
};
/** ------------------ **/
