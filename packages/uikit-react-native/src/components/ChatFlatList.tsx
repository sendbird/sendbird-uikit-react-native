import React, { ForwardedRef, forwardRef, useRef } from 'react';
import { FlatListProps, Platform, FlatList as RNFlatList, ScrollViewProps, StyleSheet } from 'react-native';

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, SendbirdMessage, getMessageUniqId, useFreshCallback } from '@sendbird/uikit-utils';

let ANDROID_BUG_ALERT_SHOWED = Platform.OS !== 'android';
const BOTTOM_DETECT_THRESHOLD = 25;
const UNREACHABLE_THRESHOLD = Number.MIN_SAFE_INTEGER;

type FlatListBidirectional<T = SendbirdMessage> = (
  props: FlatListProps<T> & BidirectionalProps<T>,
) => React.ReactElement;
type BidirectionalProps<T> = {
  onStartReached?: ((info: { distanceFromStart: number }) => void) | null | undefined;
  onStartReachedThreshold?: number | null | undefined;
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null | undefined;
  onEndReachedThreshold?: number | null | undefined;
  maintainVisibleContentPosition?: ScrollViewProps['maintainVisibleContentPosition'];
  ref: ForwardedRef<RNFlatList<T>>;
};

function shouldUseScrollViewEnhancer() {
  if (Platform.constants.reactNativeVersion.major < 1) {
    if (Platform.constants.reactNativeVersion.minor < 72) {
      return true;
    }
  }
  return false;
}

function getFlatList(): FlatListBidirectional {
  try {
    return !shouldUseScrollViewEnhancer()
      ? require('@sendbird/react-native-scrollview-enhancer').FlatList
      : require('react-native').FlatList;
  } catch {
    return require('react-native').FlatList;
  }
}

const FlatList = getFlatList();

type Props = Omit<FlatListProps<SendbirdMessage>, 'onEndReached'> & {
  onBottomReached: () => void;
  onTopReached: () => void;
  onScrolledAwayFromBottom: (value: boolean) => void;
};
// FIXME: Inverted FlatList performance issue on Android {@link https://github.com/facebook/react-native/issues/30034}
const ChatFlatList = forwardRef<RNFlatList, Props>(function CustomFlatList(
  { onTopReached, onBottomReached, onScrolledAwayFromBottom, onScroll, ...props },
  ref,
) {
  const { select } = useUIKitTheme();
  const contentOffsetY = useRef(0);

  const _onScroll = useFreshCallback<NonNullable<Props['onScroll']>>((event) => {
    onScroll?.(event);

    const { contentOffset } = event.nativeEvent;

    const prevOffsetY = contentOffsetY.current;
    const currOffsetY = contentOffset.y;

    if (BOTTOM_DETECT_THRESHOLD < prevOffsetY && currOffsetY <= BOTTOM_DETECT_THRESHOLD) {
      onScrolledAwayFromBottom(false);
    } else if (BOTTOM_DETECT_THRESHOLD < currOffsetY && prevOffsetY <= BOTTOM_DETECT_THRESHOLD) {
      onScrolledAwayFromBottom(true);
    }

    contentOffsetY.current = contentOffset.y;
  });

  if (__DEV__ && !ANDROID_BUG_ALERT_SHOWED) {
    ANDROID_BUG_ALERT_SHOWED = true;
    // eslint-disable-next-line no-console
    console.warn(
      'UIKit Warning: The inverted FlatList has a performance issue on Android. Maybe this is a bug.\n' +
        'Please refer to the link: https://github.com/facebook/react-native/issues/30034',
    );
  }

  return (
    <FlatList
      bounces={false}
      removeClippedSubviews
      keyboardDismissMode={'on-drag'}
      keyboardShouldPersistTaps={'handled'}
      indicatorStyle={select({ light: 'black', dark: 'white' })}
      {...props}
      // FIXME: inverted list of ListEmptyComponent is reversed {@link https://github.com/facebook/react-native/issues/21196#issuecomment-836937743}
      inverted={Boolean(props.data?.length)}
      ref={ref}
      onEndReached={onTopReached}
      onScrollToIndexFailed={NOOP}
      onStartReached={onBottomReached}
      scrollEventThrottle={16}
      onScroll={_onScroll}
      keyExtractor={getMessageUniqId}
      style={{ flex: 1, ...StyleSheet.flatten(props.style) }}
      maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: UNREACHABLE_THRESHOLD }}
    />
  );
});

export default ChatFlatList;
