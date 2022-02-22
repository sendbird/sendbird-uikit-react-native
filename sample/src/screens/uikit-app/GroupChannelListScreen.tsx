import { useNavigation } from '@react-navigation/native';
import React, { useContext, useLayoutEffect } from 'react';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';
import { GroupChannelListContext, useConnection } from '@sendbird/uikit-react-native-core';
import { Header, Icon } from '@sendbird/uikit-react-native-foundation';
import { Logger } from '@sendbird/uikit-utils';

/**
 * Example for customizing navigation header with DomainContext
 * Component should return null for hide uikit header
 * */
// import { TouchableOpacity } from 'react-native';
// const UseNavigationHeader = () => {
//   const { setOptions, goBack } = useNavigation();
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
//   const { navigate } = useNavigation<any>();
//
//   return (
//     <CustomGroupChannelListFragment
//       TypeSelectorHeader={null}
//       skipTypeSelection={false}
//       onPressCreateChannel={(channelType) => navigate('InviteMembersScreen', { channelType })}
//       onPressChannel={(channel) => {
//         // Navigate to GroupChannelFragment
//         Logger.log('channel pressed', channel.url);
//       }}
//     />
//   );
// };

// replace whole header from module
const DisconnectionHeader = () => {
  const { goBack, setOptions } = useNavigation<any>();
  const { disconnect } = useConnection();
  const fragment = useContext(GroupChannelListContext.Fragment);
  const typeSelector = useContext(GroupChannelListContext.TypeSelector);
  useLayoutEffect(() => {
    setOptions({ headerShown: false });
  }, []);
  const onBack = () => {
    goBack();
    disconnect();
  };
  return (
    <Header
      title={fragment.headerTitle}
      right={<Icon icon={'create'} />}
      onPressRight={typeSelector.show}
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onBack}
    />
  );
};
const DefaultGroupChannelListFragment = createGroupChannelListFragment({ Header: DisconnectionHeader });
const DefaultGroupChannelListScreen = () => {
  const { navigate } = useNavigation<any>();

  return (
    <DefaultGroupChannelListFragment
      skipTypeSelection={false}
      onPressCreateChannel={(channelType) => navigate('InviteMembersScreen', { channelType })}
      onPressChannel={(channel) => {
        // Navigate to GroupChannelFragment
        Logger.log('channel pressed', channel.url);
      }}
    />
  );
};

export default DefaultGroupChannelListScreen;
