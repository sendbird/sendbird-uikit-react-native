import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useSafeAreaPadding } from '@sendbird/uikit-utils';

type Props = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A View that reserves the bottom safe area of the window that hosts it. Render it as a child of Modal.
 *
 * A modal is presented in its own native window, so a component rendered above the modal reads the
 * insets of the view that hosts the app, which is `bottom: 0` once the app has consumed that inset.
 * */
const ModalSafeAreaBottom = ({ style, children }: Props) => {
  const { paddingBottom } = useSafeAreaPadding(['bottom']);
  return <View style={[style, { paddingBottom }]}>{children}</View>;
};

export default ModalSafeAreaBottom;
