import React, { useEffect } from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';

/**
 * Example for customize navigation header with DomainContext
 * Component should return null for hide uikit header
 * @example
 * ```
 *  const UseReactNavigationHeader = () => {
 *    const { navigation } = useAppNavigation<Routes.GroupChannelList>();
 *    const fragment = useContext(GroupChannelListContexts.Fragment);
 *    const typeSelector = useContext(GroupChannelListContexts.TypeSelector);
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
  const { navigation, params } = useAppNavigation<Routes.GroupChannelList>();

  useEffect(() => {
    setTimeout(() => {
      if (params?.channelUrl) {
        navigation.navigate(Routes.GroupChannel, { channelUrl: params.channelUrl });
      }
    }, 500);
  }, [params?.channelUrl]);

  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        navigation.navigate(Routes.GroupChannelCreate, { channelType });
      }}
      onPressChannel={(channel) => {
        navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url });
      }}
    />
  );
};

export default GroupChannelListScreen;
