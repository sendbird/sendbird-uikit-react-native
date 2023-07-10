import type { ForwardedRef, ReactElement } from 'react';
import type { FlatListProps, FlatList as RNFlatList, ScrollViewProps } from 'react-native';
import { Platform } from 'react-native';

import type { SendbirdMessage } from '@sendbird/uikit-utils';

type FlatListBidirectional<T = SendbirdMessage> = (props: FlatListProps<T> & BidirectionalProps<T>) => ReactElement;
type BidirectionalProps<T> = {
  onStartReached?: ((info: { distanceFromStart: number }) => void) | null | undefined;
  onStartReachedThreshold?: number | null | undefined;
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null | undefined;
  onEndReachedThreshold?: number | null | undefined;
  maintainVisibleContentPosition?: ScrollViewProps['maintainVisibleContentPosition'];
  ref: ForwardedRef<RNFlatList<T>>;
};

function shouldUseScrollViewEnhancer() {
  if (Platform.constants.reactNativeVersion?.major < 1) {
    if (Platform.constants.reactNativeVersion?.minor < 72) {
      return true;
    }
  }
  return false;
}
function getFlatList(): FlatListBidirectional {
  if (shouldUseScrollViewEnhancer()) {
    try {
      return require('@sendbird/react-native-scrollview-enhancer').FlatList;
    } catch {
      return require('react-native').FlatList;
    }
  } else {
    return require('react-native').FlatList;
  }
}

const FlatListInternal = getFlatList();
export default FlatListInternal;
