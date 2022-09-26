import { useNavigation } from '@react-navigation/native';
import React, { useContext, useLayoutEffect } from 'react';
import { Pressable } from 'react-native';

import {
  GroupChannelListContexts,
  GroupChannelListContextsType,
  GroupChannelListModule,
  createGroupChannelListFragment,
} from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-usage}
 * */
const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelListScreen = () => {
  const navigateToGroupChannelCreateScreen = () => void 0;
  const navigateToGroupChannelScreen = () => void 0;

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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-context}
 * */
function _context(_: GroupChannelListContextsType) {
  const fragment = useContext(_.Fragment);
  _fragment.headerTitle.length;

  const list = useContext(_.TypeSelector);
  _list.visible;
  _list.show();
  _list.hide();
  _list.headerTitle.length;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-context-3-fragment}
 * */
// TODO: import useContext, GroupChannelListContexts
const { headerTitle: _ } = useContext(GroupChannelListContexts.Fragment);
/** ------------------ **/

/**
 * TypeSelector
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-context-3-typeselector}
 * */
// TODO: import useContext, GroupChannelListContexts
const { headerTitle, visible, show, hide } = useContext(GroupChannelListContexts.TypeSelector);
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-customization}
 * */
const UseReactNavigationHeader: GroupChannelListModule['Header'] = () => {
  // TODO: no destructure navigation
  const navigation = useNavigation();
  const fragment = useContext(GroupChannelListContexts.Fragment);
  const typeSelector = useContext(GroupChannelListContexts.TypeSelector);

  useLayoutEffect(() => {
    // Show react-navigation header.
    navigation.setOptions({
      headerShown: true,
      headerTitle: fragment.headerTitle,
      headerLeft: () => (
        <Pressable onPress={typeSelector.show}>
          <Icon icon={'create'} />
        </Pressable>
      ),
    });
  }, []);

  // Hide @sendbird/uikit-react-native header.
  return null;
};

const GroupChannelListFragment2 = createGroupChannelListFragment({
  Header: UseReactNavigationHeader,
});

const CustomGroupChannelListScreen2 = () => {
  const navigateToGroupChannelCreateScreen = () => void 0;
  const navigateToGroupChannelScreen = () => void 0;

  return (
    <GroupChannelListFragment2
      onPressCreateChannel={navigateToGroupChannelCreateScreen}
      onPressChannel={navigateToGroupChannelScreen}
    />
  );
};
/** ------------------ **/
