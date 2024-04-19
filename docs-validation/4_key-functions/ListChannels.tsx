import type { GroupChannelListContextsType, GroupChannelListModule } from '@gathertown/uikit-react-native';
import React, { useContext, useLayoutEffect } from 'react';

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-usage}
 * */
import { createGroupChannelListFragment } from '@gathertown/uikit-react-native';

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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-context}
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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-context-3-fragment}
 * */
// import { useContext } from 'react';
import { GroupChannelListContexts } from '@gathertown/uikit-react-native';

const Component = () => {
  const { headerTitle } = useContext(GroupChannelListContexts.Fragment);
};
/** ------------------ **/

/**
 * TypeSelector
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-context-3-typeselector}
 * */
// import { useContext } from 'react';
// import { GroupChannelListContexts } from '@gathertown/uikit-react-native';

const Component2 = () => {
  const { headerTitle, visible, show, hide } = useContext(GroupChannelListContexts.TypeSelector);
};
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/list-channels#2-customization}
 * */
// import React, { useContext, useLayoutEffect } from 'react';
import { Pressable } from 'react-native';

import { useNavigation } from '@react-navigation/native';

// import { createGroupChannelListFragment, GroupChannelListContexts, GroupChannelListModule } from '@gathertown/uikit-react-native';
import { Icon } from '@gathertown/uikit-react-native-foundation';

const UseReactNavigationHeader: GroupChannelListModule['Header'] = () => {
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

  // Hide @gathertown/uikit-react-native header.
  return null;
};

const GroupChannelListFragment2 = createGroupChannelListFragment({
  Header: UseReactNavigationHeader,
});

const CustomGroupChannelListScreen2 = () => {
  const navigateToGroupChannelCreateScreen = () => {};
  const navigateToGroupChannelScreen = () => {};

  return (
    <GroupChannelListFragment2
      onPressCreateChannel={navigateToGroupChannelCreateScreen}
      onPressChannel={navigateToGroupChannelScreen}
    />
  );
};
/** ------------------ **/
