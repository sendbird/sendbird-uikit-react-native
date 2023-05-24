import React, { forwardRef, useRef } from 'react';
import { FlatListProps, Platform, FlatList as RNFlatList, StyleSheet } from 'react-native';

import { FlatList } from '@sendbird/react-native-scrollview-enhancer';
import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, SendbirdMessage, getMessageUniqId, useFreshCallback } from '@sendbird/uikit-utils';

let ANDROID_BUG_ALERT_SHOWED = Platform.OS !== 'android';
const BOTTOM_DETECT_THRESHOLD = 25;
const UNREACHABLE_THRESHOLD = Number.MIN_SAFE_INTEGER;

type Props = Omit<FlatListProps<SendbirdMessage>, 'onEndReached'> & {
  onBottomReached: () => void;
  onTopReached: () => void;
  onScrolledAwayFromBottom: (value: boolean) => void;
};
// FIXME: Inverted FlatList performance issue on Android {@link https://github.com/facebook/react-native/issues/30034}
const ChatFlatList = forwardRef<RNFlatList<SendbirdMessage>, Props>(function CustomFlatList(
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
      'UIKit Warning: Inverted FlatList has a performance issue on Android, Maybe this is a bug please refer link\nhttps://github.com/facebook/react-native/issues/30034',
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
