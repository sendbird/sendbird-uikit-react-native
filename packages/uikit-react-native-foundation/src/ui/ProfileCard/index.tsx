import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import Divider from '../../components/Divider';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Avatar from '../Avatar';

type Props = {
  uri: string;
  username: string;

  button?: JSX.Element;

  bodyLabel: string;
  body: string;

  containerStyle?: StyleProp<ViewStyle>;
};

const ProfileCard = ({ uri, username, bodyLabel, body, button, containerStyle }: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.profileCard.default.none;

  return (
    <View style={[styles.container, { backgroundColor: color.background }, containerStyle]}>
      <View style={styles.profileContainer}>
        <Avatar uri={uri} size={80} containerStyle={styles.profileAvatar} />
        <Text h1 color={color.textUsername} numberOfLines={1}>
          {username}
        </Text>
      </View>
      {button && <View style={styles.messageButtonArea}>{button}</View>}
      <Divider space={16} />
      <View style={styles.profileInfoContainer}>
        <Text body2 color={color.textBodyLabel} style={styles.profileInfoBodyLabel}>
          {bodyLabel}
        </Text>
        <Text body3 numberOfLines={1} color={color.textBody}>
          {body}
        </Text>
      </View>
    </View>
  );
};

const styles = createStyleSheet({
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
  messageButtonArea: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
});

export default ProfileCard;
