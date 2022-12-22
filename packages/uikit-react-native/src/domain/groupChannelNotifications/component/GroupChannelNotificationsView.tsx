import React, { useContext } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { PushTriggerOption } from '@sendbird/chat';
import { Divider, Icon, Switch, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { useForceUpdate } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../hooks/useContext';
import { GroupChannelNotificationsContexts } from '../module/moduleContext';

const GroupChannelNotificationsView = () => {
  const { channel } = useContext(GroupChannelNotificationsContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const forceUpdate = useForceUpdate();

  const turnedOnNotifications = channel.myPushTriggerOption !== PushTriggerOption.OFF;
  const turnedOnNotificationsOptionAll = [PushTriggerOption.ALL, PushTriggerOption.DEFAULT].some(
    (it) => it === channel.myPushTriggerOption,
  );
  const turnedOnNotificationsOptionMentionsOnly = channel.myPushTriggerOption === PushTriggerOption.MENTION_ONLY;

  const toggleNotificationSwitch = async (val: boolean) => {
    if (val) {
      await channel.setMyPushTriggerOption(PushTriggerOption.ALL);
    } else {
      await channel.setMyPushTriggerOption(PushTriggerOption.OFF);
    }
    forceUpdate();
  };

  const onPressNotificationsOption = async (option: PushTriggerOption.ALL | PushTriggerOption.MENTION_ONLY) => {
    await channel.setMyPushTriggerOption(option);
    forceUpdate();
  };

  return (
    <ScrollView bounces={false} contentContainerStyle={styles.container}>
      <Bar
        subtitle2
        title={STRINGS.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS}
        description={STRINGS.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS_DESC}
        component={<Switch value={turnedOnNotifications} onChangeValue={toggleNotificationSwitch} />}
      />
      <Divider />
      {turnedOnNotifications && (
        <>
          <Bar
            body3
            onPress={() => onPressNotificationsOption(PushTriggerOption.ALL)}
            title={STRINGS.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS_OPTION_ALL}
            component={
              <Icon
                color={turnedOnNotificationsOptionAll ? colors.primary : colors.onBackground03}
                icon={turnedOnNotificationsOptionAll ? 'radio-on' : 'radio-off'}
                size={24}
              />
            }
          />
          <Divider />
          <Bar
            body3
            onPress={() => onPressNotificationsOption(PushTriggerOption.MENTION_ONLY)}
            title={STRINGS.GROUP_CHANNEL_NOTIFICATIONS.MENU_NOTIFICATIONS_OPTION_MENTION_ONLY}
            component={
              <Icon
                color={turnedOnNotificationsOptionMentionsOnly ? colors.primary : colors.onBackground03}
                icon={turnedOnNotificationsOptionMentionsOnly ? 'radio-on' : 'radio-off'}
                size={24}
              />
            }
          />
          <Divider />
        </>
      )}
    </ScrollView>
  );
};

type BarProps = {
  title: string;
  onPress?: () => void;
  description?: string;
  component: React.ReactNode;
  subtitle2?: boolean;
  body3?: boolean;
};
const Bar = ({ title, onPress, description, component, subtitle2, body3 }: BarProps) => {
  const { colors } = useUIKitTheme();
  return (
    <Pressable onPress={onPress} style={styles.barContainer}>
      <View style={styles.titleContainer}>
        <Text body3={body3} subtitle2={subtitle2} numberOfLines={1} color={colors.onBackground01} style={styles.title}>
          {title}
        </Text>
        <View>{component}</View>
      </View>
      {Boolean(description) && (
        <Text body3 color={colors.onBackground02} style={styles.desc}>
          {description}
        </Text>
      )}
    </Pressable>
  );
};

const styles = createStyleSheet({
  container: {
    paddingHorizontal: 16,
  },
  barContainer: {
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  desc: {
    marginTop: 8,
    flex: 1,
  },
});

export default GroupChannelNotificationsView;
