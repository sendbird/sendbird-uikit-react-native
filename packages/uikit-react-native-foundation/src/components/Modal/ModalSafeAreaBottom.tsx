import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useSafeAreaPadding } from '@sendbird/uikit-utils';

type Props = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A View that reserves the bottom safe area of the window that hosts it.
 *
 * Render it as a child of {@link Modal} to keep the bottom of the modal content clear of the Android
 * system navigation bar. A modal is presented in its own native window, so the insets of the app level
 * provider describe the view that hosts the app instead of the modal window, and a component rendered
 * above the modal reads a bottom inset of `0` whenever the app has already consumed it.
 * */
const ModalSafeAreaBottom = ({ style, children }: Props) => {
  const { paddingBottom } = useSafeAreaPadding(['bottom']);
  return <View style={[style, { paddingBottom }]}>{children}</View>;
};

export default ModalSafeAreaBottom;
