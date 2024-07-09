import React, { forwardRef, useRef } from 'react';
import { FlatListProps, FlatList as RNFlatList, StyleSheet } from 'react-native';

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, SendbirdMessage, getMessageUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import FlatListInternal from '../ChatFlatList/FlatListInternal';

const BOTTOM_DETECT_THRESHOLD = 50;
const UNREACHABLE_THRESHOLD = Number.MIN_SAFE_INTEGER;

type Props = Omit<FlatListProps<SendbirdMessage>, 'onEndReached'> & {
  onBottomReached: () => void;
  onTopReached: () => void;
  onScrolledAwayFromBottom: (value: boolean) => void;
};
const ThreadChatFlatList = forwardRef<RNFlatList, Props>(function ThreadChatFlatList(
  { onTopReached, onBottomReached, onScrolledAwayFromBottom, onScroll, ...props },
  ref,
) {
  const { select } = useUIKitTheme();
  const contentOffsetY = useRef(0);

  const _onScroll = useFreshCallback<NonNullable<Props['onScroll']>>((event) => {
    onScroll?.(event);

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const prevOffsetY = contentOffsetY.current;
    const currOffsetY = contentOffset.y;

    const bottomDetectThreshold = contentSize.height - layoutMeasurement.height - BOTTOM_DETECT_THRESHOLD;
    if (bottomDetectThreshold < prevOffsetY && currOffsetY <= bottomDetectThreshold) {
      onScrolledAwayFromBottom(true);
    } else if (bottomDetectThreshold < currOffsetY && prevOffsetY <= bottomDetectThreshold) {
      onScrolledAwayFromBottom(false);
    }

    contentOffsetY.current = contentOffset.y;
  });

  return (
    <FlatListInternal
      bounces={false}
      removeClippedSubviews
      keyboardDismissMode={'on-drag'}
      keyboardShouldPersistTaps={'handled'}
      indicatorStyle={select({ light: 'black', dark: 'white' })}
      {...props}
      ref={ref}
      onEndReached={onBottomReached}
      onScrollToIndexFailed={NOOP}
      onStartReached={onTopReached}
      scrollEventThrottle={16}
      onScroll={_onScroll}
      keyExtractor={getMessageUniqId}
      style={{ flex: 1, ...StyleSheet.flatten(props.style) }}
      maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: UNREACHABLE_THRESHOLD }}
    />
  );
});

export default ThreadChatFlatList;
