import type { OpenChannelSettingsContextsType } from '@sendbird/uikit-react-native';

/**
 * Usage
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-open-channel-settings#2-usage}
 * */
import React, { useState } from 'react';
import { useSendbirdChat, createOpenChannelSettingsFragment } from '@sendbird/uikit-react-native';
import { useOpenChannel } from "@sendbird/uikit-chat-hooks";

const OpenChannelSettingsFragment = createOpenChannelSettingsFragment();
const OpenChannelSettingsScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelListScreen = () => {};
  const navigateToOpenChannelMembersScreen = () => {};
  const navigateToOpenChannelModerationScreen = () => {};
  const navigateToOpenChannel = () => {};

  return (
    <OpenChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuModeration={navigateToOpenChannelModerationScreen}
      onPressMenuParticipants={navigateToOpenChannelMembersScreen}
      onPressMenuDeleteChannel={navigateToOpenChannelListScreen}
      onNavigateToOpenChannel={navigateToOpenChannel}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-open-channel-settings#2-context}
 * */
function _context(_: OpenChannelSettingsContextsType) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle;
  fragment.headerRight;
  fragment.channel;
  fragment.onPressHeaderRight;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-open-channel-settings#2-context-3-fragment}
 * */
import { useContext } from 'react';
import { OpenChannelSettingsContexts } from '@sendbird/uikit-react-native';

const Component = () => {
  const { channel, headerTitle, headerRight, onPressHeaderRight } = useContext(OpenChannelSettingsContexts.Fragment);
}
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/configuring-channel-settings/configure-open-channel-settings#2-customization}
 * */
import { Text, Share } from 'react-native';

// import { useSendbirdChat, createOpenChannelSettingsFragment } from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';
// import { useOpenChannel } from "@sendbird/uikit-chat-hooks";

const OpenChannelSettingsFragment2 = createOpenChannelSettingsFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  Menu: () => <Text>{'Custom Menu'}</Text>,
  Info: () => <Text>{'Custom Info'}</Text>,
});
const OpenChannelSettingsScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelListScreen = () => {};
  const navigateToOpenChannelMembersScreen = () => {};
  const navigateToOpenChannelModerationScreen = () => {};
  const navigateToOpenChannel = () => {};

  return (
    <OpenChannelSettingsFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressMenuModeration={navigateToOpenChannelModerationScreen}
      onPressMenuParticipants={navigateToOpenChannelMembersScreen}
      onPressMenuDeleteChannel={navigateToOpenChannelListScreen}
      onNavigateToOpenChannel={navigateToOpenChannel}
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
