import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Box,
  Icon,
  PressBox,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';

type Props = {
  bottomInset: number;
  deleteShown: boolean;
  onPressDelete: () => void;
  onPressDownload: () => void;
};

const FileViewerFooter = ({ bottomInset, deleteShown, onPressDelete, onPressDownload }: Props) => {
  const { palette } = useUIKitTheme();
  const { defaultHeight } = useHeaderStyle();
  const { left, right } = useSafeAreaInsets();

  return (
    <Box
      style={[
        styles.container,
        {
          paddingLeft: styles.container.paddingHorizontal + left,
          paddingRight: styles.container.paddingHorizontal + right,
          paddingBottom: bottomInset,
          height: defaultHeight + bottomInset,
          backgroundColor: palette.overlay01,
        },
      ]}
    >
      <PressBox activeOpacity={0.75} onPress={onPressDownload} style={styles.buttonContainer}>
        <Icon icon={'download'} size={24} color={palette.onBackgroundDark01} />
      </PressBox>
      <Box style={styles.titleContainer} />
      <PressBox activeOpacity={0.75} onPress={onPressDelete} style={styles.buttonContainer} disabled={!deleteShown}>
        {deleteShown && <Icon icon={'delete'} size={24} color={palette.onBackgroundDark01} />}
      </PressBox>
    </Box>
  );
};

const styles = createStyleSheet({
  container: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
});

export default FileViewerFooter;
