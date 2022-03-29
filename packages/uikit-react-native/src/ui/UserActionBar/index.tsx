import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Avatar, Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

type Props = {
  uri: string;
  name: string;
  label?: string;
  disabled: boolean;
  onPressActionMenu: () => void;
};
const UserActionBar: React.FC<Props> = ({ uri, name, disabled, onPressActionMenu, label }) => {
  const { colors } = useUIKitTheme();

  const iconColor = conditionChaining([disabled], [colors.onBackground04, colors.onBackground01]);

  return (
    <View style={styles.container}>
      <Avatar size={36} uri={uri} containerStyle={styles.avatar} />
      <View style={[styles.infoContainer, { borderBottomColor: colors.onBackground04 }]}>
        <Text subtitle2 style={styles.name} color={disabled ? colors.onBackground04 : colors.onBackground01}>
          {name}
        </Text>
        {Boolean(label) && <Text>{label}</Text>}
        <TouchableOpacity onPress={onPressActionMenu} disabled={disabled}>
          <Icon color={iconColor} size={24} icon={'more'} containerStyle={{ padding: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    paddingHorizontal: 16,
  },
  avatar: {
    marginRight: 16,
  },
  infoContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  name: {
    flex: 1,
    marginRight: 8,
  },
});

export default React.memo(UserActionBar);
