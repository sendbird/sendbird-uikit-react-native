import React, { useLayoutEffect } from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';
import { Logger } from '@sendbird/uikit-utils';

import { Routes, useAppNavigation } from '../../../hooks/useAppNavigation';

/**
 * Example for customizing navigation header with DomainContext
 * Component should return null for hide uikit header
 * */
// import { TouchableOpacity } from 'react-native';
// const UseNavigationHeader = () => {
//   const { navigation } = useAppNavigation<Routes.GroupChannelList>();
//   const { goBack, setOptions } = navigation;
//   const { disconnect } = useConnection();
//   const fragment = useContext(GroupChannelListContext.Fragment);
//   const typeSelector = useContext(GroupChannelListContext.TypeSelector);
//
//   const onBack = () => {
//     goBack();
//     disconnect();
//   };
//   useLayoutEffect(() => {
//     setOptions({
//       headerShown: true,
//       headerTitle: fragment.headerTitle,
//       headerLeft: () => (
//         <TouchableOpacity onPress={onBack}>
//           <Icon icon={'arrow-left'} />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <TouchableOpacity onPress={typeSelector.show}>
//           <Icon icon={'create'} />
//         </TouchableOpacity>
//       ),
//     });
//   }, []);
//   return null;
// };
//
// const CustomGroupChannelListFragment = createGroupChannelListFragment({ Header: UseNavigationHeader });
// const CustomGroupChannelListScreen = () => {
//   const { navigation } = useAppNavigation<Routes.GroupChannelList>();
//
//   return (
//     <CustomGroupChannelListFragment
//       TypeSelectorHeader={null}
//       onPressCreateChannel={(channelType) => navigation.navigate(Routes.InviteMembers, { channelType })}
//       onPressChannel={(channel) => {
//         // Navigate to GroupChannelFragment
//         Logger.log('channel pressed', channel.url);
//       }}
//     />
//   );
// };

// replace the whole header from module
// const DisconnectionHeader = () => {
//   const { navigation } = useAppNavigation<Routes.GroupChannelList>();
//   const { goBack, setOptions } = navigation;
//   const { disconnect } = useConnection();
//   const fragment = useContext(GroupChannelListContext.Fragment);
//   const typeSelector = useContext(GroupChannelListContext.TypeSelector);
//   useLayoutEffect(() => {
//     setOptions({ headerShown: false });
//   }, []);
//   const onBack = () => {
//     goBack();
//     disconnect();
//   };
//   return (
//     <Header
//       title={fragment.headerTitle}
//       right={<Icon icon={'create'} />}
//       onPressRight={typeSelector.show}
//       left={<Icon icon={'arrow-left'} />}
//       onPressLeft={onBack}
//     />
//   );
// };
// const DefaultGroupChannelListFragment = createGroupChannelListFragment({ Header: DisconnectionHeader });

const DefaultGroupChannelListFragment = createGroupChannelListFragment();
const DefaultGroupChannelListScreen = () => {
  const { navigation } = useAppNavigation<Routes.GroupChannelList>();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <DefaultGroupChannelListFragment
      onPressCreateChannel={(channelType) => navigation.navigate(Routes.InviteMembers, { channelType })}
      onPressChannel={(channel) => {
        // Navigate to GroupChannelFragment
        Logger.log('channel pressed', channel.url);
      }}
    />
  );
};

export default DefaultGroupChannelListScreen;
