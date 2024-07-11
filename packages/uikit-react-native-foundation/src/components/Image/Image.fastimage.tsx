import React from 'react';
import { Image } from 'react-native';
import type { FastImageProps, ResizeMode, Source } from 'react-native-fast-image';

import FastImageInternal from './FastImageInternal';
import type { SendbirdImageComponent, SendbirdImageProps } from './index';

function convertCache(
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached' | undefined,
): 'immutable' | 'web' | 'cacheOnly' {
  switch (cache) {
    case 'force-cache':
    case 'only-if-cached':
      return 'cacheOnly';
    default:
      return 'immutable';
  }
}

function convertSource(source: SendbirdImageProps['source']): Source | number {
  if (Array.isArray(source)) {
    return convertSource(source[0]);
  }

  if (typeof source === 'number') {
    return source;
  }

  return {
    uri: source?.uri,
    headers: source?.headers,
    cache: convertCache(source?.cache), //'immutable' | 'web' | 'cacheOnly'
  };
}
function convertDefaultSource(source?: SendbirdImageProps['defaultSource']): number | undefined {
  if (typeof source === 'number') {
    return source;
  }

  return undefined;
}

function convertResizeMode(mode?: SendbirdImageProps['resizeMode']): ResizeMode | undefined {
  switch (mode) {
    case 'center':
      return 'center';
    case 'contain':
      return 'contain';
    case 'cover':
      return 'cover';
    case 'stretch':
      return 'stretch';
    default:
      return undefined;
  }
}

const Image_FastImage: SendbirdImageComponent = ({
  source,
  defaultSource,
  resizeMode,
  onLoad,
  onError,
  style,
  tintColor,
  disableFastImage = false,
  ...props
}) => {
  if (disableFastImage) {
    return (
      <Image
        {...props}
        source={source}
        style={[style, { tintColor }]}
        onError={onError && ((e) => onError(e.nativeEvent))}
        onLoad={onLoad && ((e) => onLoad(e.nativeEvent.source))}
      />
    );
  }
  return (
    <FastImageInternal
      {...props}
      onLoad={onLoad && ((e) => onLoad(e.nativeEvent))}
      onError={onError && (() => onError({}))}
      style={style as FastImageProps['style']}
      source={convertSource(source)}
      defaultSource={convertDefaultSource(defaultSource)}
      resizeMode={convertResizeMode(resizeMode)}
    />
  );
};

export default Image_FastImage;
