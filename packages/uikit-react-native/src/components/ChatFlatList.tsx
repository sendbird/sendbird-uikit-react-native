import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { FlatListProps, Platform, FlatList as RNFlatList, StyleSheet } from 'react-native';

import { FlatList } from '@sendbird/react-native-scrollview-enhancer';
import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { SendbirdMessage, getMessageUniqId, isMyMessage } from '@sendbird/uikit-utils';

let ANDROID_BUG_ALERT_SHOWED = Platform.OS !== 'android';
const BOTTOM_DETECT_THRESHOLD = 25;

export type ChatFlatListRef = { scrollToBottom: (animated?: boolean) => void };
type Props = Omit<FlatListProps<SendbirdMessage>, 'onEndReached'> & {
  currentUserId?: string;
  onBottomReached: () => void;
  onTopReached: () => void;
  onScrolledAwayFromBottom: (value: boolean) => void;

  /** @deprecated Please use `onScrolledAwayFromBottom` **/
  onLeaveScrollBottom?: (value: boolean) => void;
  /** @deprecated Not used anymore **/
  nextMessages?: unknown;
};
// FIXME: Inverted FlatList performance issue on Android {@link https://github.com/facebook/react-native/issues/30034}
const ChatFlatList = forwardRef<ChatFlatListRef, Props>(function CustomFlatList(
  { onTopReached, onBottomReached, onScrolledAwayFromBottom, onLeaveScrollBottom, onScroll, currentUserId, ...props },
  ref,
) {
  const { select } = useUIKitTheme();
  const scrollRef = useRef<RNFlatList<SendbirdMessage>>(null);
  const contentOffsetY = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: (animated = true) => scrollRef.current?.scrollToOffset({ animated, offset: 0 }),
    }),
    [],
  );

  // Scroll to bottom when current user send a message
  const recentMessage = props.data?.[0];
  useEffect(() => {
    if (isMyMessage(recentMessage, currentUserId)) {
      scrollRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [currentUserId, recentMessage]);

  const _onScroll = useCallback<NonNullable<Props['onScroll']>>(
    (event) => {
      onScroll?.(event);

      const { contentOffset } = event.nativeEvent;

      const prevOffsetY = contentOffsetY.current;
      const currOffsetY = contentOffset.y;

      if (BOTTOM_DETECT_THRESHOLD < prevOffsetY && currOffsetY <= BOTTOM_DETECT_THRESHOLD) {
        onScrolledAwayFromBottom(false);
        onLeaveScrollBottom?.(false);
      } else if (BOTTOM_DETECT_THRESHOLD < currOffsetY && prevOffsetY <= BOTTOM_DETECT_THRESHOLD) {
        onScrolledAwayFromBottom(true);
        onLeaveScrollBottom?.(true);
      }

      contentOffsetY.current = contentOffset.y;
    },
    [onScroll],
  );

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
      ref={scrollRef}
      onEndReachedThreshold={0.5}
      onEndReached={onTopReached}
      onStartReachedThreshold={0.5}
      onStartReached={onBottomReached}
      scrollEventThrottle={16}
      onScroll={_onScroll}
      keyExtractor={getMessageUniqId}
      style={{ flex: 1, ...StyleSheet.flatten(props.style) }}
      maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: BOTTOM_DETECT_THRESHOLD }}
    />
  );
});

export default ChatFlatList;
