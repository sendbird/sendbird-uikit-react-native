import React from 'react';
import type { FastImageProps, ResizeMode, Source } from 'react-native-fast-image';

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
    uri: source.uri,
    headers: source.headers,
    cache: convertCache(source.cache), //'immutable' | 'web' | 'cacheOnly'
  };
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

let FastImage: (props: FastImageProps) => JSX.Element | null = () => null;

try {
  FastImage = require('react-native-fast-image') as (props: FastImageProps) => JSX.Element;
} catch {}

const Image_FastImage: SendbirdImageComponent = ({ source, resizeMode, onLoad, onError, style, ...props }) => {
  return (
    <FastImage
      {...props}
      onLoad={onLoad && ((e) => onLoad(e.nativeEvent))}
      onError={onError && (() => onError({}))}
      style={style as FastImageProps['style']}
      source={convertSource(source)}
      resizeMode={convertResizeMode(resizeMode)}
    />
  );
};

export default Image_FastImage;
