import React, { useLayoutEffect } from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

import { Routes, useAppNavigation } from '../../../hooks/useAppNavigation';

/**
 * Example for customize navigation header with DomainContext
 * Component should return null for hide uikit header
 * @example
 * ```
 *  const UseReactNavigationHeader = () => {
 *    const { navigation } = useAppNavigation<Routes.GroupChannelList>();
 *    const fragment = useContext(GroupChannelListContext.Fragment);
 *    const typeSelector = useContext(GroupChannelListContext.TypeSelector);
 *
 *    useLayoutEffect(() => {
 *      navigation.setOptions({
 *        headerShown: true,
 *        headerTitle: fragment.headerTitle,
 *        headerLeft: (
 *          <TouchableOpacity onPress={typeSelector.show}>
 *            <Icon icon={'create'} />
 *          </TouchableOpacity>
 *        )
 *      })
 *    },[])
 *
 *    return null;
 *  }
 *
 *  const GroupChannelListFragment = createGroupChannelListFragment({ Header: UseReactNavigationHeader });
 *
 *  const CustomGroupChannelListScreen = () => {
 *    const navigateToInviteMembersScreen = (channelType) => { ... };
 *    const navigateToGroupChannelScreen = (channel) => { ... };
 *
 *    return <GroupChannelListFragment
 *             onPressCreateChannel={navigateToInviteMembersScreen}
 *             onPressChannel={navigateToGroupChannelScreen}
 *           />
 *  }
 * ```
 * */
const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelListScreen = () => {
  const { navigation } = useAppNavigation<Routes.GroupChannelList>();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        navigation.navigate(Routes.InviteMembers, { channelType });
      }}
      onPressChannel={(channel) => {
        navigation.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      }}
    />
  );
};

export default GroupChannelListScreen;
