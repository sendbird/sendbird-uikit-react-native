import type { GroupChannelListContextsType, GroupChannelListModule } from '@sendbird/uikit-react-native';
import React, { useContext, useLayoutEffect } from 'react';

const CustomChannelPreview = (_:object) => <></>

/**
 * Usage
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/list-channels#2-usage}
 * */
import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelListScreen = () => {
  const navigateToGroupChannelCreateScreen = () => {};
  const navigateToGroupChannelScreen = () => {};

  return (
    <GroupChannelListFragment
      onPressCreateChannel={navigateToGroupChannelCreateScreen}
      onPressChannel={navigateToGroupChannelScreen}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/list-channels#2-context}
 * */
function _context(_: GroupChannelListContextsType) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle.length;

  const list = useContext(_.TypeSelector);
  list.visible;
  list.show();
  list.hide();
  list.headerTitle.length;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/list-channels#2-context-3-fragment}
 * */
// import { useContext } from 'react';
import { GroupChannelListContexts } from '@sendbird/uikit-react-native';

const Component = () => {
  const { headerTitle } = useContext(GroupChannelListContexts.Fragment);
};
/** ------------------ **/

/**
 * TypeSelector
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/list-channels#2-context-3-typeselector}
 * */
// import { useContext } from 'react';
// import { GroupChannelListContexts } from '@sendbird/uikit-react-native';

const Component2 = () => {
  const { headerTitle, visible, show, hide } = useContext(GroupChannelListContexts.TypeSelector);
};
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/list-channels#2-customization}
 * */
// import React from 'react';
import { Text } from 'react-native';
// import { GroupChannelListModule } from '@sendbird/uikit-react-native';

const CustomHeader: GroupChannelListModule['Header'] = () => {
  return <Text>{'Custom Header'}</Text>;
};
const CustomList: GroupChannelListModule['List'] = () => {
  return <Text>{'Custom List'}</Text>;
};
const CustomEmpty: GroupChannelListModule['StatusEmpty'] = () => {
  return <Text>{'Custom Empty'}</Text>;
};
const CustomLoading: GroupChannelListModule['StatusLoading'] = () => {
  return <Text>{'Custom Loading'}</Text>;
};

const GroupChannelListFragment2 = createGroupChannelListFragment({
  Header: CustomHeader,
  List:CustomList,
  StatusEmpty: CustomEmpty,
  StatusLoading: CustomLoading,
});

const CustomGroupChannelListScreen2 = () => {
  const navigateToGroupChannelCreateScreen = () => {};
  const navigateToGroupChannelScreen = () => {};

  return (
    <GroupChannelListFragment2
      onPressCreateChannel={navigateToGroupChannelCreateScreen}
      onPressChannel={navigateToGroupChannelScreen}
      // Render custom channel preview
      renderGroupChannelPreview={(props) => {
        return <CustomChannelPreview {...props} />;
      }}
      // Apply query parameters for channel list
      channelListQueryParams={{
        includeEmpty: true,
        includeFrozen: false,
      }}
    />
  );
};
/** ------------------ **/
