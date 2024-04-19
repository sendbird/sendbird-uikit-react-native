import React from 'react';

const GroupChannelScreen = () => <React.Fragment />;

/**
 * Set up navigation in a fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/screen-navigation#2-set-up-navigation-in-a-fragment}
 * */
// @ts-ignore
import { Navigation } from 'react-native-navigation';
import { createGroupChannelListFragment } from '@gathertown/uikit-react-native';

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
