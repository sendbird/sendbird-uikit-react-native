import React from 'react';
import { View } from 'react-native';

import { Avatar, Box, Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

type Props = {
  uri: string;
  name: string;
  selected: boolean;
  disabled: boolean;
};
const UserSelectableBar = ({ uri, name, selected, disabled }: Props) => {
  const { colors } = useUIKitTheme();

  const iconColor = conditionChaining(
    [disabled, selected],
    [colors.onBackground04, colors.primary, colors.onBackground03],
  );

  return (
    <View style={styles.container}>
      <Avatar size={36} uri={uri} containerStyle={styles.avatar} />
      <View style={[styles.infoContainer, { borderBottomColor: colors.onBackground04 }]}>
        <Box flex={1} alignItems={'flex-start'}>
          <Text subtitle2 numberOfLines={1} style={styles.name} color={colors.onBackground01}>
            {name}
          </Text>
        </Box>
        <Icon color={iconColor} size={24} icon={selected ? 'checkbox-on' : 'checkbox-off'} />
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
    marginEnd: 16,
  },
  infoContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  name: {
    marginEnd: 8,
  },
});

export default UserSelectableBar;
