import React from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

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
 *    const navigateToGroupChannelCreateScreen = (channelType) => { ... };
 *    const navigateToGroupChannelScreen = (channel) => { ... };
 *
 *    return <GroupChannelListFragment
 *             onPressCreateChannel={navigateToGroupChannelCreateScreen}
 *             onPressChannel={navigateToGroupChannelScreen}
 *           />
 *  }
 * ```
 * */
const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelListScreen = () => {
  const { navigation } = useAppNavigation<Routes.GroupChannelList>();

  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        navigation.navigate(Routes.GroupChannelCreate, { channelType });
      }}
      onPressChannel={(channel) => {
        navigation.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      }}
    />
  );
};

export default GroupChannelListScreen;
