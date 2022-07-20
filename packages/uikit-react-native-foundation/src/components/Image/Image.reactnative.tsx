import React from 'react';
import { Image } from 'react-native';

import type { SendbirdImageComponent } from './index';

const Image_ReactNative: SendbirdImageComponent = ({ onLoad, onError, ...props }) => {
  return (
    <Image
      {...props}
      onError={onError && ((e) => onError(e.nativeEvent))}
      onLoad={onLoad && ((e) => onLoad(e.nativeEvent.source))}
    />
  );
};

export default Image_ReactNative;
