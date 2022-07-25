import React from 'react';
import { Image } from 'react-native';

import type { SendbirdImageComponent } from './index';

const Image_ReactNative: SendbirdImageComponent = ({ onLoad, onError, style, tintColor, ...props }) => {
  return (
    <Image
      {...props}
      style={[style, { tintColor }]}
      onError={onError && ((e) => onError(e.nativeEvent))}
      onLoad={onLoad && ((e) => onLoad(e.nativeEvent.source))}
    />
  );
};

export default Image_ReactNative;
