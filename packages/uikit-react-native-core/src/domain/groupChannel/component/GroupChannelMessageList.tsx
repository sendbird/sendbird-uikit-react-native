import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, FlatListProps, ListRenderItem, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChannelFrozenBanner, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { isMyMessage, messageKeyExtractor } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import type { GroupChannelProps } from '../types';

const HANDLE_NEXT_MSG_SEPARATELY = Platform.select({ android: true, ios: false });
const GroupChannelMessageList: React.FC<GroupChannelProps['MessageList']> = ({
  channel,
  messages,
  renderMessage,
  nextMessages,
  newMessagesFromNext,
  onBottomReached,
  onTopReached,
  NewMessagesTooltip,
  ScrollToBottomTooltip,
}) => {
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();
  const { left, right } = useSafeAreaInsets();
  const [scrollLeaveBottom, setScrollLeaveBottom] = useState(false);
  const scrollRef = useRef<CustomFlatListRef>(null);

  const safeAreaLayout = { paddingLeft: left, paddingRight: right };

  // NOTE: Cannot wrap with useCallback, because prevMessage (always getting from fresh messages)
  const renderItem: ListRenderItem<SendbirdMessage> = ({ item, index }) => (
    <View style={{}}>{renderMessage(item, messages[index + 1], messages[index - 1])}</View>
  );

  const [newMessages, setNewMessages] = useState(() => newMessagesFromNext);

  useEffect(() => {
    if (HANDLE_NEXT_MSG_SEPARATELY) return;
    newMessagesFromNext.length !== 0 && setNewMessages((prev) => prev.concat(newMessagesFromNext));
    onBottomReached();
  }, [newMessagesFromNext]);

  const onLeaveScrollBottom = useCallback((val: boolean) => {
    if (!HANDLE_NEXT_MSG_SEPARATELY) setNewMessages([]);
    setScrollLeaveBottom(val);
  }, []);

  return (
    <View style={[{ flex: 1 }, safeAreaLayout]}>
      {channel.isFrozen && (
        <ChannelFrozenBanner style={styles.frozenBanner} text={LABEL.GROUP_CHANNEL.FRAGMENT.LIST_BANNER_FROZEN} />
      )}
      <CustomFlatList
        listKey={`group-channel-messages-${channel.url}`}
        ref={scrollRef}
        data={messages}
        nextMessages={nextMessages}
        renderItem={renderItem}
        keyExtractor={messageKeyExtractor}
        onBottomReached={onBottomReached}
        onTopReached={onTopReached}
        contentContainerStyle={[channel.isFrozen && styles.frozenListPadding, { backgroundColor: colors.background }]}
        onLeaveScrollBottom={onLeaveScrollBottom}
      />
      {NewMessagesTooltip && (
        <View style={[styles.newMsgTooltip, safeAreaLayout]}>
          <NewMessagesTooltip
            visible={scrollLeaveBottom}
            onPress={() => scrollRef.current?.scrollToBottom(false)}
            newMessages={HANDLE_NEXT_MSG_SEPARATELY ? newMessagesFromNext : newMessages}
          />
        </View>
      )}
      {ScrollToBottomTooltip && (
        <View style={[styles.scrollTooltip, safeAreaLayout]}>
          <ScrollToBottomTooltip visible={scrollLeaveBottom} onPress={() => scrollRef.current?.scrollToBottom(false)} />
        </View>
      )}
    </View>
  );
};

function hasReachedToBottom(yPos: number, thresholdPx = 0) {
  return thresholdPx >= yPos;
}

type Props = Omit<FlatListProps<SendbirdMessage>, 'onEndReached'> & {
  onBottomReached: () => void;
  onTopReached: () => void;
  nextMessages: SendbirdMessage[];
  onLeaveScrollBottom: (value: boolean) => void;
};
const BOTTOM_DETECT_THRESHOLD = 15;
type CustomFlatListRef = { scrollToBottom: (animated?: boolean) => void };
const CustomFlatList = forwardRef<CustomFlatListRef, Props>(function CustomFlatList(
  { onTopReached, nextMessages, onBottomReached, onLeaveScrollBottom, onScroll, ...props },
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
    } else if (isMyMessage(latestMessage)) {
      scrollRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [onBottomReached, nextMessages]);

  const _onScroll: Props['onScroll'] = useCallback(
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

  return (
    <FlatList
      {...props}
      // FIXME: Inverted FlatList performance issue on Android {@link https://github.com/facebook/react-native/issues/30034}
      inverted
      // FIXME: maintainVisibleContentPosition is not working on Android {@link https://github.com/facebook/react-native/issues/25239}
      maintainVisibleContentPosition={{ minIndexForVisible: 1, autoscrollToTopThreshold: BOTTOM_DETECT_THRESHOLD - 5 }}
      ref={scrollRef}
      bounces={false}
      keyboardDismissMode={'on-drag'}
      indicatorStyle={select({ light: 'black', dark: 'white' })}
      removeClippedSubviews
      onEndReachedThreshold={0.25}
      onEndReached={onTopReached}
      onScroll={_onScroll}
    />
  );
});

const styles = createStyleSheet({
  frozenBanner: {
    position: 'absolute',
    zIndex: 999,
    top: 8,
    left: 8,
    right: 8,
  },
  frozenListPadding: {
    paddingBottom: 32,
  },
  newMsgTooltip: {
    position: 'absolute',
    zIndex: 999,
    bottom: 10,
    alignSelf: 'center',
  },
  scrollTooltip: {
    position: 'absolute',
    zIndex: 998,
    bottom: 10,
    right: 16,
  },
});

export default GroupChannelMessageList;
