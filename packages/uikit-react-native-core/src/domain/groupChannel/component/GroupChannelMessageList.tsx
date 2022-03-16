import isSameDay from 'date-fns/isSameDay';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList as DefaultFlatList, FlatListProps, ListRenderItem, View } from 'react-native';

import { Text } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { isMyMessage } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import type { GroupChannelProps } from '../types';

const GroupChannelMessageList: React.FC<GroupChannelProps['MessageList']> = ({
  messages,
  renderMessage,
  nextMessages,
  newMessagesFromNext,
  onBottomReached,
  onTopReached,
  NewMessageTooltip,
}) => {
  const { LABEL } = useLocalization();
  // NOTE: Cannot wrap with useCallback, because prevMessage (always getting from fresh messages)
  const renderItem: ListRenderItem<SendbirdMessage> = ({ item, index }) => {
    const prevMessage = messages[index + 1];

    const sameDay = isSameDay(item.createdAt, prevMessage?.createdAt ?? 0);
    const separator = sameDay ? null : (
      <Text>--- {LABEL.GROUP_CHANNEL.FRAGMENT.LIST_DATE_SEPARATOR(new Date(item.createdAt))} ---</Text>
    );

    return (
      <View style={{ flexDirection: 'row' }}>
        {separator}
        {renderMessage(item)}
        <Text>{index}</Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        nextMessages={nextMessages}
        renderItem={renderItem}
        onBottomReached={onBottomReached}
        onTopReached={onTopReached}
      />
      {NewMessageTooltip && (
        <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }}>
          <NewMessageTooltip newMessages={newMessagesFromNext} />
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
};
const FlatList: React.FC<Props> = ({ onTopReached, nextMessages, onBottomReached, onScroll, ...props }) => {
  const scrollRef = useRef<DefaultFlatList<SendbirdMessage>>(null);
  const yPos = useRef(0);

  useEffect(() => {
    const latestMessage = nextMessages[nextMessages.length - 1];
    if (!latestMessage) return;

    if (hasReachedToBottom(yPos.current)) {
      onBottomReached();
    } else if (isMyMessage(latestMessage)) {
      scrollRef.current?.scrollToEnd({ animated: false });
    }
  }, [onBottomReached, nextMessages]);

  const _onScroll: Props['onScroll'] = useCallback(
    (event) => {
      yPos.current = event.nativeEvent.contentOffset.y;

      onScroll?.(event);
      if (hasReachedToBottom(yPos.current)) onBottomReached();
    },
    [onScroll, onBottomReached],
  );

  return (
    <DefaultFlatList
      {...props}
      ref={scrollRef}
      inverted
      onEndReachedThreshold={0.25}
      onEndReached={onTopReached}
      onScroll={_onScroll}
    />
  );
};

export default GroupChannelMessageList;
