import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  Divider,
  Image,
  Modal,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { SendbirdReaction, getReactionCount, truncatedCount } from '@sendbird/uikit-utils';

import type { ReactionBottomSheetProps } from './index';

const ReactionUserListBottomSheet = ({
  visible,
  onClose,
  onDismiss,
  reactionCtx,
  chatCtx,
  localizationCtx,
  userProfileCtx,
}: ReactionBottomSheetProps) => {
  const { width } = useWindowDimensions();
  const { bottom, left, right } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();

  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>();
  const tabIndicatorValue = useRef<Array<{ x: number; width: number }>>([]);
  const tabIndicatorAnimated = useRef({ x: new Animated.Value(0), width: new Animated.Value(0) }).current;
  const focusedWithLayoutCalculated = useRef(false);

  const { emojiManager } = chatCtx;
  const { channel, message, focusIndex } = reactionCtx;
  const { STRINGS } = localizationCtx;

  const color = colors.ui.reaction.default;
  const reactions = message?.reactions ?? [];
  const focusedReaction = reactions[tabIndex] as SendbirdReaction | undefined;
  const containerSafeArea = {
    paddingLeft: left + styles.layout.paddingHorizontal,
    paddingRight: right + styles.layout.paddingHorizontal,
  };

  const focusTab = (index: number, animated = true) => {
    const indicatorValue = tabIndicatorValue.current[index];
    if (indicatorValue) {
      setTabIndex(index);
      animateTabIndicator(indicatorValue.x, indicatorValue.width, animated);
      scrollRef.current?.scrollTo({ x: indicatorValue.x, animated });
    }
  };

  const animateTabIndicator = (x: number, width: number, animated = true) => {
    const baseConfig = { duration: animated ? 300 : 0, easing: Easing.inOut(Easing.ease), useNativeDriver: false };
    Animated.parallel([
      Animated.timing(tabIndicatorAnimated.x, { toValue: x, ...baseConfig }),
      Animated.timing(tabIndicatorAnimated.width, { toValue: width, ...baseConfig }),
    ]).start();
  };

  const layoutCalculated = () => {
    return tabIndicatorValue.current.length === reactions.length && tabIndicatorValue.current.every(Boolean);
  };

  useEffect(() => {
    if (!visible) {
      tabIndicatorValue.current = [];
      tabIndicatorAnimated.x = new Animated.Value(0);
      tabIndicatorAnimated.width = new Animated.Value(0);
      focusedWithLayoutCalculated.current = false;
    }
  }, [visible]);

  const renderTabs = () => {
    return (
      <Pressable style={styles.tabsWrapper}>
        {reactions.map((reaction, index) => {
          const isFocused = focusedReaction?.key === reaction.key;
          const isLastItem = reactions.length - 1 === index;
          const emoji = emojiManager.allEmojiMap[reaction.key];

          return (
            <Pressable
              key={reaction.key}
              style={[styles.tabItem, isLastItem && { marginRight: styles.layout.marginRight }]}
              onPress={() => focusTab(index)}
              onLayout={(e) => {
                tabIndicatorValue.current[index] = e.nativeEvent.layout;
                if (layoutCalculated()) {
                  if (focusedWithLayoutCalculated.current) {
                    focusTab(tabIndex, false);
                  } else {
                    focusedWithLayoutCalculated.current = true;
                    focusTab(focusIndex);
                  }
                }
              }}
            >
              <Image source={{ uri: emoji.url }} style={styles.tabEmoji} />
              <Text button color={isFocused ? color.selected.highlight : color.enabled.highlight}>
                {truncatedCount(getReactionCount(reaction))}
              </Text>
            </Pressable>
          );
        })}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              left: tabIndicatorAnimated.x,
              width: tabIndicatorAnimated.width,
              backgroundColor: color.selected.highlight,
            },
          ]}
        />
      </Pressable>
    );
  };

  const renderPage = () => {
    return (
      <>
        {focusedReaction?.userIds.map((userId) => {
          if (channel?.isGroupChannel()) {
            const user = channel.members.find((x) => x.userId === userId);
            return (
              <Pressable
                key={userId}
                onPress={async () => {
                  if (user) {
                    await onClose();
                    userProfileCtx.show(user);
                  }
                }}
                style={styles.pageItem}
              >
                <Avatar size={36} uri={user?.profileUrl} containerStyle={styles.avatar} />
                <Text subtitle2 style={{ flex: 1 }}>
                  {user?.nickname || STRINGS.LABELS.USER_NO_NAME}
                </Text>
              </Pressable>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <Modal
      type={'slide-no-gesture'}
      visible={Boolean(visible && channel && message)}
      onClose={onClose}
      onDismiss={onDismiss}
      backgroundStyle={styles.modal}
    >
      <View
        style={[
          styles.container,
          { width, paddingBottom: bottom, backgroundColor: colors.ui.dialog.default.none.background },
        ]}
      >
        <ScrollView
          ref={scrollRef as never}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[containerSafeArea, styles.tabsContainer]}
        >
          {renderTabs()}
        </ScrollView>
        <Divider style={{ top: -1 }} />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.pageContainer}
          contentContainerStyle={containerSafeArea}
        >
          {renderPage()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = createStyleSheet({
  layout: {
    paddingHorizontal: 16,
    marginRight: 0,
  },
  container: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingTop: 16,
    alignItems: 'center',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabsContainer: {
    flexGrow: 1,
  },
  tabsWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 44,
  },
  tabItem: {
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    width: 28,
    height: 28,
    marginRight: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
  },
  pageContainer: {
    height: 216,
    width: '100%',
  },
  pageItem: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
});

export default ReactionUserListBottomSheet;
