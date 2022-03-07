import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { useTotalUnreadMessageCount } from '@sendbird/chat-react-hooks';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Icon, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { Routes } from '../../../hooks/useAppNavigation';
import GroupChannelListScreen from './GroupChannelListScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const GroupChannelTabs = () => {
  const { colors, typography } = useUIKitTheme();
  const { sdk } = useSendbirdChat();
  const totalUnreadMessages = useTotalUnreadMessageCount(sdk);
  return (
    <Tab.Navigator
      initialRouteName={Routes.GroupChannelList}
      screenOptions={{ tabBarActiveTintColor: colors.primary, tabBarLabelStyle: typography.caption2 }}
    >
      <Tab.Screen
        name={Routes.GroupChannelList}
        component={GroupChannelListScreen}
        options={{
          tabBarLabel: 'Channels',
          tabBarBadge: totalUnreadMessages || undefined,
          tabBarIcon: ({ color }) => <Icon icon={'chat-filled'} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.Settings}
        component={SettingsScreen}
        options={{
          tabBarLabel: 'My settings',
          tabBarIcon: ({ color }) => <Icon icon={'settings-filled'} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default GroupChannelTabs;
