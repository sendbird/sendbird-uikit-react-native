import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { FlatList, FlatListProps, Platform } from 'react-native';

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { SendbirdMessage, getMessageUniqId, isMyMessage } from '@sendbird/uikit-utils';

let ANDROID_BUG_ALERT_SHOWED = Platform.OS !== 'android';
const BOTTOM_DETECT_THRESHOLD = 25;
// const AUTO_SCROLL_TO_TOP_THRESHOLD = 15;

function hasReachedToBottom(yPos: number, thresholdPx = 0) {
  return thresholdPx >= yPos;
}

export type ChatFlatListRef = { scrollToBottom: (animated?: boolean) => void };
type Props = Omit<FlatListProps<SendbirdMessage>, 'onEndReached'> & {
  currentUserId?: string;
  onBottomReached: () => void;
  onTopReached: () => void;
  nextMessages: SendbirdMessage[];
  onLeaveScrollBottom: (value: boolean) => void;
};
// FIXME: Inverted FlatList performance issue on Android {@link https://github.com/facebook/react-native/issues/30034}
const ChatFlatList = forwardRef<ChatFlatListRef, Props>(function CustomFlatList(
  { onTopReached, nextMessages, onBottomReached, onLeaveScrollBottom, onScroll, currentUserId, ...props },
  ref,
) {
  const { select } = useUIKitTheme();
  const scrollRef = useRef<FlatList<SendbirdMessage>>(null);
  const yPos = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: (animated = true) => scrollRef.current?.scrollToOffset({ animated, offset: 0 }),
    }),
    [],
  );

  useEffect(() => {
    const latestMessage = nextMessages[nextMessages.length - 1];
    if (!latestMessage) return;

    if (hasReachedToBottom(yPos.current)) {
      onBottomReached();
    } else if (isMyMessage(latestMessage, currentUserId)) {
      scrollRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [onBottomReached, nextMessages, currentUserId]);

  const _onScroll = useCallback<NonNullable<Props['onScroll']>>(
    (event) => {
      const { contentOffset } = event.nativeEvent;
      if (BOTTOM_DETECT_THRESHOLD < yPos.current && contentOffset.y <= BOTTOM_DETECT_THRESHOLD) {
        onLeaveScrollBottom(false);
      } else if (BOTTOM_DETECT_THRESHOLD < contentOffset.y && yPos.current <= BOTTOM_DETECT_THRESHOLD) {
        onLeaveScrollBottom(true);
      }

      yPos.current = contentOffset.y;

      onScroll?.(event);
      if (hasReachedToBottom(yPos.current)) onBottomReached();
    },
    [onScroll, onBottomReached],
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
      // FIXME: maintainVisibleContentPosition is not working on Android {@link https://github.com/facebook/react-native/issues/25239}
      // maintainVisibleContentPosition={{ minIndexForVisible: 1, autoscrollToTopThreshold: AUTO_SCROLL_TO_TOP_THRESHOLD }}
      ref={scrollRef}
      onEndReachedThreshold={0.5}
      onEndReached={onTopReached}
      scrollEventThrottle={16}
      onScroll={_onScroll}
      keyExtractor={getMessageUniqId}
    />
  );
});

export default ChatFlatList;
