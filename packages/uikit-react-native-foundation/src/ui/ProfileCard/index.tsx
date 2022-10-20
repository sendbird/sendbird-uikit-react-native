import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';

import Divider from '../../components/Divider';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Avatar from '../Avatar';

type Props = {
  uri: string;
  username: string;

  bodyLabel: string;
  body: string;
};

// TODO: Extract as component
type OutlinedButtonProps = {
  children: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const OutlinedButton = ({ children, containerStyle }: OutlinedButtonProps) => {
  return (
    <Pressable style={[styles.outlinedButton, containerStyle]}>
      <Text button numberOfLines={1} style={styles.outlinedButtonText}>
        {children}
      </Text>
    </Pressable>
  );
};

const ProfileCard = ({ uri, username, bodyLabel, body }: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.profileCard.default.none;

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.profileContainer}>
        <Avatar uri={uri} size={80} containerStyle={styles.profileAvatar} />
        <Text h1 color={color.textUsername}>
          {username}
        </Text>
      </View>
      <OutlinedButton containerStyle={styles.messageButton}>{'Message'}</OutlinedButton>
      <Divider space={16} />
      <View style={styles.profileInfoContainer}>
        <Text body2 color={color.textBodyLabel} style={styles.profileInfoBodyLabel}>
          {bodyLabel}
        </Text>
        <Text body3 color={color.textBody}>
          {body}
        </Text>
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  outlinedButton: {
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonText: {
    textAlign: 'center',
    width: '100%',
  },

  container: {
    paddingTop: 32,
    width: '100%',
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  profileAvatar: {
    marginBottom: 8,
  },
  profileInfoContainer: {
    padding: 16,
  },
  profileInfoBodyLabel: {
    marginBottom: 4,
  },
  messageButton: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
});

export default ProfileCard;
