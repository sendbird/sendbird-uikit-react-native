import React from 'react';
import { View } from 'react-native';

import { Avatar, Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

type Props = {
  uri: string;
  name: string;
  selected: boolean;
};
const UserListItem: React.FC<Props> = ({ uri, name, selected }) => {
  const { colors } = useUIKitTheme();
  return (
    <View style={styles.container}>
      <Avatar size={36} uri={uri} containerStyle={styles.avatar} />
      <View style={[styles.infoContainer, { borderBottomColor: colors.onBackground04 }]}>
        <Text subtitle2 style={styles.name}>
          {name}
        </Text>
        <Icon size={24} icon={selected ? 'checkbox-on' : 'checkbox-off'} />
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

export default React.memo(UserListItem);
