import React from 'react';

import {
  Box,
  Icon,
  PressBox,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { useSafeAreaPadding } from '@sendbird/uikit-utils';

type Props = {
  bottomInset: number;
  deleteShown: boolean;
  onPressDelete: () => void;
  onPressDownload: () => void;
};

const FileViewerFooter = ({ bottomInset, deleteShown, onPressDelete, onPressDownload }: Props) => {
  const { palette } = useUIKitTheme();
  const { defaultHeight } = useHeaderStyle();
  const safeArea = useSafeAreaPadding(['left', 'right']);

  return (
    <Box
      style={[
        styles.container,
        {
          paddingStart: styles.container.paddingHorizontal + safeArea.paddingStart,
          paddingEnd: styles.container.paddingHorizontal + safeArea.paddingEnd,
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
    start: 0,
    end: 0,
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
