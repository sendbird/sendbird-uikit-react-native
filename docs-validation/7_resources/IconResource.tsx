import React from 'react';
import { Image, Pressable } from 'react-native';

import { Icon } from '@sendbird/uikit-react-native-foundation';

/**
 * Icon component
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/icon-resource#2-how-to-use-3-icon-component}
 * */
// TODO: import Pressable, props type
const CameraButton = (props: object) => {
  return (
    <Pressable {...props}>
      <Icon icon={'camera'} size={24} color={'black'} />
    </Pressable>
  );
};
/** ------------------ **/

/**
 * Icon.Assets
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/icon-resource#2-how-to-use-3-icon-assets}
 * */
// TODO: import Pressable, Image, props type
const CameraButton2 = (props: object) => {
  return (
    <Pressable {...props}>
      <Image source={Icon.Assets['camera']} style={{ width: 24, height: 24, tintColor: 'black' }} />
    </Pressable>
  );
};
/** ------------------ **/

/**
 * Customize the icons
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/icon-resource#2-customize-the-icons}
 * */
Icon.Assets['error'] = require('your_icons/your-error-icon.png');
/** ------------------ **/
