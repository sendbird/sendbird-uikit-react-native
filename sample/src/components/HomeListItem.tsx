import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

type Props = React.PropsWithChildren<{
  onPress: () => void;
  title: string;
  desc: string;
  image: any;
}>;
const HomeListItem = ({ title, desc, image, onPress }: Props) => {
  const { select, colors } = useUIKitTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: select({ light: colors.background, dark: colors.onBackground04 }) }]}
    >
      <View style={styles.infoContainer}>
        <View style={styles.infoText}>
          <Text h2 color={colors.onBackground01} style={{ marginBottom: 8 }}>
            {title}
          </Text>
          <Text body3 color={colors.onBackground02}>
            {desc}
          </Text>
        </View>
        <Image resizeMode={'contain'} source={image} style={styles.infoImage} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    width: '100%',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  infoText: {
    flex: 1,
    marginRight: 16,
  },
  infoImage: {
    width: 78,
    height: 64,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default HomeListItem;
