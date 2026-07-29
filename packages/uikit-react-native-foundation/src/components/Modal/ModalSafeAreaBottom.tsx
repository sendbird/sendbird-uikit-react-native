import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useSafeAreaPadding } from '@sendbird/uikit-utils';

type Props = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

const ModalSafeAreaBottom = ({ style, children }: Props) => {
  const { paddingBottom } = useSafeAreaPadding(['bottom']);
  return <View style={[style, { paddingBottom }]}>{children}</View>;
};

export default ModalSafeAreaBottom;
