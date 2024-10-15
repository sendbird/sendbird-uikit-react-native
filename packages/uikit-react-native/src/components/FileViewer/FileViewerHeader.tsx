import React from 'react';

import {
  Box,
  Icon,
  PressBox,
  Text,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { truncate, useSafeAreaPadding } from '@sendbird/uikit-utils';

type Props = {
  headerShown?: boolean;
  topInset: number;
  onClose: () => void;
  title: string;
  subtitle: string;
};

const FileViewerHeader = ({ headerShown = true, topInset, onClose, subtitle, title }: Props) => {
  const { palette } = useUIKitTheme();
  const { defaultHeight } = useHeaderStyle();
  const safeArea = useSafeAreaPadding(['left', 'right']);

  if (!headerShown) return null;

  return (
    <Box
      style={[
        styles.container,
        {
          paddingStart: styles.container.paddingHorizontal + safeArea.paddingStart,
          paddingEnd: styles.container.paddingHorizontal + safeArea.paddingEnd,
          paddingTop: topInset,
          height: defaultHeight + topInset,
          backgroundColor: palette.overlay01,
        },
      ]}
    >
      <PressBox activeOpacity={0.75} onPress={onClose} style={styles.buttonContainer}>
        <Icon icon={'close'} size={24} color={palette.onBackgroundDark01} />
      </PressBox>
      <Box style={styles.titleContainer}>
        <Text h2 color={palette.onBackgroundDark01} style={styles.title} numberOfLines={1}>
          {truncate(title, { mode: 'mid', maxLen: 18 })}
        </Text>
        <Text caption2 color={palette.onBackgroundDark01} numberOfLines={1}>
          {subtitle}
        </Text>
      </Box>
      <Box style={styles.buttonContainer} />
    </Box>
  );
};

const styles = createStyleSheet({
  container: {
    zIndex: 1,
    top: 0,
    start: 0,
    end: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 2,
  },
});

export default FileViewerHeader;
