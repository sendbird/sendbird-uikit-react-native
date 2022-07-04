import React, { useMemo } from 'react';

import { createGroupChannelFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

/**
 * Example for customize navigation header with DomainContext
 * Component should return null for hide uikit header
 *
 * Especially in GroupChannel (chatting view)
 * you should provide your custom header height to GroupChannel as a keyboardAvoidOffset prop
 * to fix Input component position properly (when focused)
 *
 * @example
 * ```
 * import React, { useContext, useEffect } from 'react';
 * import { Pressable } from 'react-native';
 *
 * import { useNavigation } from "@react-navigation/native";
 * import { useHeaderHeight } from '@react-navigation/elements';
 *
 * import { GroupChannelContexts, GroupChannelModule } from '@sendbird/uikit-react-native-core';
 * import { Icon } from '@sendbird/uikit-react-native-foundation';
 *
 * const UseReactNavigationHeader: GroupChannelModule['Header'] = ({ onPressHeaderRight, onPressHeaderLeft }) => {
 *   const navigation = useNavigation();
 *   const { headerTitle } = useContext(GroupChannelContexts.Fragment);
 *   useEffect(() => {
 *     navigation.setOptions({
 *       headerShown: true,
 *       headerTitleAlign: 'center',
 *       title: headerTitle,
 *       headerLeft: () => (
 *         <Pressable onPress={onPressHeaderLeft}>
 *           <Icon icon={'arrow-left'} />
 *         </Pressable>
 *       ),
 *       headerRight: () => (
 *         <Pressable onPress={onPressHeaderRight}>
 *           <Icon icon={'info'} />
 *         </Pressable>
 *       ),
 *     });
 *   }, []);
 *   return null;
 * };
 *
 * const GroupChannelFragment = createGroupChannelFragment({ Header: UseReactNavigationHeader });
 *
 * const GroupChannelScreen = () => {
 *   // ...
 *   const height = useHeaderHeight();
 *
 *   return (
 *     <GroupChannelFragment
 *       keyboardAvoidOffset={height}
 *       // ...
 *     />
 *   )
 * }
 *
 * ```
 * */

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>();
  const { sdk } = useSendbirdChat();
  const staleChannel = useMemo(
    () => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
    [params.serializedChannel],
  );

  return (
    <GroupChannelFragment
      staleChannel={staleChannel}
      onPressImageMessage={(msg, uri) => {
        // Navigate to photo preview
        Logger.log('file uri', msg.name, uri);
      }}
      onChannelDeleted={() => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to group channel information
        navigation.navigate(Routes.GroupChannelSettings, { serializedChannel: params.serializedChannel });
      }}
    />
  );
};

export default GroupChannelScreen;
