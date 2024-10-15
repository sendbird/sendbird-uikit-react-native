import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, I18nManager, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import {
  Avatar,
  Divider,
  Image,
  Modal,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { SendbirdReaction, getReactionCount, truncatedCount, useSafeAreaPadding } from '@sendbird/uikit-utils';

import type { ReactionBottomSheetProps } from './index';

const ReactionUserListBottomSheet = ({
  visible,
  onClose,
  onDismiss,
  reactionCtx,
  chatCtx,
  localizationCtx,
  onPressUserProfile,
}: ReactionBottomSheetProps) => {
  const { width } = useWindowDimensions();
  const safeArea = useSafeAreaPadding(['left', 'right', 'bottom']);
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
    paddingStart: safeArea.paddingStart + styles.layout.paddingHorizontal,
    paddingEnd: safeArea.paddingEnd + styles.layout.paddingHorizontal,
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
    return tabIndicatorValue.current.filter(Boolean).length === reactions.length;
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
              style={[styles.tabItem, isLastItem && { marginEnd: styles.layout.marginEnd }]}
              onPress={() => focusTab(index)}
              onLayout={(e) => {
                const indexForLayout = I18nManager.isRTL ? reactions.length - 1 - index : index;
                tabIndicatorValue.current[indexForLayout] = e.nativeEvent.layout;
                if (layoutCalculated()) {
                  if (focusedWithLayoutCalculated.current) {
                    // re-calculating layout when screen rotation
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
              start: tabIndicatorAnimated.x,
              width: tabIndicatorAnimated.width,
              backgroundColor: color.selected.highlight,
            },
          ]}
        />
      </Pressable>
    );
  };

  const renderPage = () => {
    const userCountDifference = (focusedReaction?.count || 0) - (focusedReaction?.sampledUserInfoList.length || 0);

    return (
      <>
        {focusedReaction?.sampledUserInfoList.map((reactedUserInfo) => {
          if (channel?.isGroupChannel()) {
            return (
              <Pressable
                key={reactedUserInfo.userId}
                onPress={async () => {
                  await onClose();
                  onPressUserProfile(reactedUserInfo);
                }}
                style={styles.pageItem}
              >
                <Avatar size={36} uri={reactedUserInfo?.profileUrl} containerStyle={styles.avatar} />
                <Text subtitle2 style={{ flex: 1 }}>
                  {reactedUserInfo?.nickname || STRINGS.LABELS.USER_NO_NAME}
                </Text>
              </Pressable>
            );
          }
          return null;
        })}
        {userCountDifference > 0 && (
          <View style={styles.pageItem}>
            <Text body3 color={colors.onBackground02}>
              {STRINGS.REACTION.MORE_USERS(userCountDifference)}
            </Text>
          </View>
        )}
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
          { width, paddingBottom: safeArea.paddingBottom, backgroundColor: colors.ui.dialog.default.none.background },
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
    marginEnd: 0,
  },
  container: {
    overflow: 'hidden',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
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
    marginEnd: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    width: 28,
    height: 28,
    marginEnd: 4,
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
    marginEnd: 16,
  },
});

export default ReactionUserListBottomSheet;
