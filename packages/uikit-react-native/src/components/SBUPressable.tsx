import React from 'react';
import { Pressable, PressableProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { DEFAULT_LONG_PRESS_DELAY } from '../constants';

type Components = 'Pressable' | 'TouchableOpacity';
type Props<T extends Components = 'Pressable'> = {
  as?: T;
} & ExtractProps<T, AsProps>;

type AsProps =
  | {
      type: 'Pressable';
      props: PressableProps;
    }
  | {
      type: 'TouchableOpacity';
      props: TouchableOpacityProps;
    };

type ExtractProps<T extends Components, U extends AsProps> = U extends { type: T; props: infer P } ? P : never;

function getComponent(as?: Components) {
  switch (as) {
    case 'Pressable':
      return Pressable;
    case 'TouchableOpacity':
      return TouchableOpacity;
    default:
      return Pressable;
  }
}

const SBUPressable = <T extends Components>({ as, ...props }: Props<T>) => {
  const Renderer = getComponent(as);
  // @ts-ignore
  return <Renderer delayLongPress={DEFAULT_LONG_PRESS_DELAY} {...props} />;
};

export default SBUPressable;
