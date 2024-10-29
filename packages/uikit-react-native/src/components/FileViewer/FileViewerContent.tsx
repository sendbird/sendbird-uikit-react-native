import { ReactNativeZoomableView, ReactNativeZoomableViewProps } from '@openspacelabs/react-native-zoomable-view';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { ImageProps, ImageStyle, ImageURISource, StyleProp, StyleSheet, useWindowDimensions } from 'react-native';

import {
  Box,
  Image,
  LoadingSpinner,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { FileType, useIIFE } from '@sendbird/uikit-utils';

import { usePlatformService } from '../../hooks/useContext';
import SBUUtils from '../../libs/SBUUtils';

type Props = {
  type: FileType;
  src: string;
  topInset?: number;
  bottomInset?: number;
  maxZoom?: number;
  minZoom?: number;
  onPress?: () => void;
};
const FileViewerContent = ({ type, src, topInset = 0, bottomInset = 0, maxZoom = 4, minZoom = 1, onPress }: Props) => {
  const [loading, setLoading] = useState(true);

  const { defaultHeight } = useHeaderStyle();
  const { mediaService } = usePlatformService();
  const { palette } = useUIKitTheme();

  const source = { uri: src };
  const onLoadEnd = () => setLoading(false);
  const mediaViewer = useIIFE(() => {
    switch (type) {
      case 'image': {
        return (
          <ZoomableImageView
            source={source}
            style={StyleSheet.absoluteFill}
            resizeMode={'contain'}
            onLoadEnd={onLoadEnd}
            zoomProps={{
              minZoom,
              maxZoom,
              onTouchEnd: onPress,
            }}
          />
        );
      }

      case 'video':
      case 'audio': {
        return (
          <mediaService.VideoComponent
            source={source}
            style={[StyleSheet.absoluteFill, { top: topInset, bottom: defaultHeight + bottomInset }]}
            resizeMode={'contain'}
            onLoad={onLoadEnd}
          />
        );
      }

      default: {
        return null;
      }
    }
  });

  return (
    <Box style={styles.container}>
      {mediaViewer}
      {loading && <LoadingSpinner style={{ position: 'absolute' }} size={40} color={palette.primary300} />}
    </Box>
  );
};

const ZoomableImageView = ({
  zoomProps,
  ...props
}: {
  source: ImageURISource;
  style: StyleProp<ImageStyle>;
  resizeMode: ImageProps['resizeMode'];
  onLoadEnd: () => void;
  zoomProps?: ReactNativeZoomableViewProps;
}) => {
  const { width, height } = useWindowDimensions();

  const imageSize = useRef<{ width: number; height: number }>();
  const [contentSizeProps, setContentSizeProps] = useState<ReactNativeZoomableViewProps>({
    contentWidth: width,
    contentHeight: height,
  });

  useLayoutEffect(() => {
    SBUUtils.safeRun(async () => {
      if (props.source.uri) {
        const image = imageSize.current ?? (await SBUUtils.getImageSize(props.source.uri));
        imageSize.current = image;

        const viewRatio = width / height;
        const imageRatio = image.width / image.height;

        const fitDirection = viewRatio > imageRatio ? 'height' : 'width';
        const ratio = fitDirection === 'height' ? height / image.height : width / image.width;
        const actualSize = { width: image.width * ratio, height: image.height * ratio };

        setContentSizeProps({
          contentWidth: actualSize.width,
          contentHeight: actualSize.height,
        });
      }
    });
  }, [props.source.uri, width, height]);

  return (
    <ReactNativeZoomableView
      visualTouchFeedbackEnabled={false}
      style={{ width, height }}
      initialZoom={1}
      {...contentSizeProps}
      {...zoomProps}
    >
      <Image {...props} />
    </ReactNativeZoomableView>
  );
};

const styles = createStyleSheet({
  container: {
    zIndex: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FileViewerContent;
