import React, { useContext, useState } from 'react';
import { Share } from 'react-native';

import {
  GroupChannelSettingsContextsType,
  createGroupChannelSettingsFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-usage}
 * */
/** ------------------ **/
// TODO: params type, sdk.groupChannel
const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen = ({ params }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelMembersScreen = () => {};

  return (
    <GroupChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      // TODO: onLeaveChannel -> onPressMenuLeaveChannel
      onLeaveChannel={navigateToGroupChannelListScreen}
      onPressMenuMembers={navigateToGroupChannelMembersScreen}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-context}
 * */
function _context(_: GroupChannelSettingsContextsType) {
  const fragment = useContext(_.Fragment);
  _fragment.headerTitle;
  _fragment.headerRight;
  _fragment.channel;
  _fragment.onPressHeaderRight;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-context-3-fragment}
 * */
// TODO: import useContext, GroupChannelSettingsContexts
const { channel, headerTitle, headerRight, onPressHeaderRight } = useContext(GroupChannelSettingsContexts.Fragment);
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-customization}
 * */
const GroupChannelSettingsFragment2 = createGroupChannelSettingsFragment();
// TODO: params type, sdk.groupChannel
const GroupChannelSettingsScreen2 = ({ params }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelMembersScreen = () => {};

  return (
    <GroupChannelSettingsFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      // TODO: onLeaveChannel -> onPressMenuLeaveChannel
      onLeaveChannel={navigateToGroupChannelListScreen}
      onPressMenuMembers={navigateToGroupChannelMembersScreen}
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
