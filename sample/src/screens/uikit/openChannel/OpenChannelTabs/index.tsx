import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { Icon, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import SettingsScreen from '../../SettingsScreen';
import OpenChannelListCommunityScreen from './OpenChannelListCommunityScreen';
import OpenChannelListLiveStreamsScreen from './OpenChannelListLiveStreamsScreen';

const Tab = createBottomTabNavigator();

const OpenChannelTabs = () => {
  const { params } = useAppNavigation<Routes.OpenChannelTabs>();

  const { colors, typography } = useUIKitTheme();

  return (
    <Tab.Navigator
      initialRouteName={Routes.OpenChannelListLiveStreams}
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: typography.caption2,
      }}
    >
      <Tab.Screen
        name={Routes.OpenChannelListLiveStreams}
        component={OpenChannelListLiveStreamsScreen}
        initialParams={params}
        options={{
          tabBarLabel: 'Live streams',
          tabBarIcon: ({ color }) => <Icon icon={'streaming'} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.OpenChannelListCommunity}
        component={OpenChannelListCommunityScreen}
        initialParams={params}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({ color }) => <Icon icon={'channels'} color={color} />,
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

export default OpenChannelTabs;
