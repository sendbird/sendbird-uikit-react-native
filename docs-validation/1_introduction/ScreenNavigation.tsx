import React from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

const GroupChannelScreen = () => <React.Fragment />;
const Navigation = {
  push: (_id: string, _data: object) => 0,
  registerComponent: (_name: string, _get: Function) => 0,
};

//
//
//
//
//
//

/**
 * Set up navigation in a fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/screen-navigation#2-set-up-navigation-in-a-fragment}
 * */
// TODO: import createGroupChannelListFragment
const GroupChannelListFragment = createGroupChannelListFragment();

const GroupChannelListScreen = (props: { componentId: string }) => {
  return (
    <GroupChannelListFragment
      onPressCreateChannel={() => {
        // Navigate to create group channel screen.
      }}
      onPressChannel={(channel) => {
        // Navigate to group channel screen.
        Navigation.push(props.componentId, {
          component: {
            name: 'GroupChannel',
            passProps: { channel },
          },
        });
      }}
    />
  );
};
/** ------------------ **/

/**
 * Integrate navigation library
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/screen-navigation#2-integrate-navigation-library}
 * */
Navigation.registerComponent('GroupChannel', () => GroupChannelScreen);
Navigation.registerComponent('GroupChannelList', () => GroupChannelListScreen);
/** ------------------ **/
