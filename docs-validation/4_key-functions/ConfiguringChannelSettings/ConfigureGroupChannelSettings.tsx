import type { GroupChannelSettingsContextsType } from '@sendbird/uikit-react-native';

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-usage}
 * */
import React, { useState } from 'react';
import { useSendbirdChat, createGroupChannelSettingsFragment } from '@sendbird/uikit-react-native';

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen = ({ params }: { params: { serializedChannel: object } }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.groupChannel.buildGroupChannelFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelMembersScreen = () => {};

  return (
    <GroupChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuLeaveChannel={navigateToGroupChannelListScreen}
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
  fragment.headerTitle;
  fragment.headerRight;
  fragment.channel;
  fragment.onPressHeaderRight;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-context-3-fragment}
 * */
import { useContext } from 'react';
import { GroupChannelSettingsContexts } from '@sendbird/uikit-react-native';

const Component = () => {
  const { channel, headerTitle, headerRight, onPressHeaderRight } = useContext(GroupChannelSettingsContexts.Fragment);
}
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-group-channel-settings#2-customization}
 * */
import { Share } from 'react-native';

import { Icon } from '@sendbird/uikit-react-native-foundation';

const GroupChannelSettingsFragment2 = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen2 = ({ params }: { params: { serializedChannel: object } }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.groupChannel.buildGroupChannelFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelMembersScreen = () => {};

  return (
    <GroupChannelSettingsFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuLeaveChannel={navigateToGroupChannelListScreen}
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
