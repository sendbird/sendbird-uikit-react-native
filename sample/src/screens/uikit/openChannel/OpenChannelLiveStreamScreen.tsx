import React, { useContext } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { useChannelHandler, useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { OpenChannelContexts, createOpenChannelFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import {
  Avatar,
  Box,
  Header,
  Icon,
  Image,
  PressBox,
  Text,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';
import { useForceUpdate } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';
import { OpenChannelCustomType, parseStreamData } from '../../../libs/openChannel';

const useIsLandscape = () => {
  const { width, height } = useWindowDimensions();
  return width > height;
};

const StreamView = (props: { channel: SendbirdOpenChannel; height: number | string }) => {
  const { navigation } = useAppNavigation<Routes.OpenChannelLiveStream>();
  const { topInset } = useHeaderStyle();
  const { colors, palette } = useUIKitTheme();
  const isLandscape = useIsLandscape();
  const { sdk } = useSendbirdChat();
  const forceUpdate = useForceUpdate();

  useChannelHandler(
    sdk,
    'UIKitSample_StreamView',
    {
      onChannelParticipantCountChanged() {
        forceUpdate();
      },
    },
    'open',
  );

  const streamData = parseStreamData(props.channel.data);
  const streamInfoPosition = isLandscape ? 20 : 12;
  if (!streamData) return null;

  return (
    <Box style={{ height: props.height, width: '100%' }} flex={isLandscape ? 1.2 : 0}>
      <Image style={StyleSheet.absoluteFill} resizeMode={'cover'} source={{ uri: streamData.live_channel_url }} />
      <Box style={StyleSheet.absoluteFill} backgroundColor={palette.overlay02} />
      <PressBox activeOpacity={0.8} onPress={() => navigation.goBack()}>
        <Icon
          size={24}
          icon={'close'}
          color={'white'}
          containerStyle={{ position: 'absolute', left: streamInfoPosition, top: streamInfoPosition + topInset }}
        />
      </PressBox>
      <Box
        flexDirection={'row'}
        alignItems={'center'}
        style={{ position: 'absolute', left: streamInfoPosition, bottom: streamInfoPosition }}
      >
        <Box backgroundColor={colors.error} width={10} height={10} borderRadius={5} marginRight={4} />
        <Text button color={palette.onBackgroundDark01} style={{ marginRight: 16 }}>
          {'Live'}
        </Text>
        <Text body3 color={palette.onBackgroundDark01}>
          {`${props.channel.participantCount} participants`}
        </Text>
      </Box>
    </Box>
  );
};

const OpenChannelFragment = createOpenChannelFragment({
  Header: ({ onPressHeaderRight, rightIconName }) => {
    const { channel } = useContext(OpenChannelContexts.Fragment);
    const { HeaderComponent } = useHeaderStyle();
    const isLandscape = useIsLandscape();
    const streamData = parseStreamData(channel.data);
    if (!streamData) return null;

    return (
      <HeaderComponent
        clearTitleMargin
        clearStatusBarTopInset={!isLandscape}
        title={
          <Box flexDirection={'row'} alignItems={'center'} style={styles.titleContainer}>
            <Avatar uri={streamData.thumbnail_url} size={34} containerStyle={styles.avatarGroup} />
            <Box flexShrink={1}>
              <Header.Title h2>{streamData.name}</Header.Title>
              <Header.Subtitle style={styles.subtitle}>{streamData.creator_info.name}</Header.Subtitle>
            </Box>
          </Box>
        }
        right={<Icon icon={rightIconName} />}
        onPressRight={onPressHeaderRight}
      />
    );
  },
});

const OpenChannelLiveStreamScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelLiveStream>();
  const isLandscape = useIsLandscape();
  const { topInset } = useHeaderStyle();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const streamViewHeight = isLandscape ? '100%' : 200 + topInset;
  const keyboardAvoidOffset = isLandscape ? 0 : (streamViewHeight as number);

  return (
    <Box flex={1} flexDirection={isLandscape ? 'row' : 'column'}>
      {/*<StatusBar hidden animated />*/}
      <StreamView height={streamViewHeight} channel={channel} />
      <OpenChannelFragment
        keyboardAvoidOffset={keyboardAvoidOffset}
        channel={channel}
        onPressMediaMessage={(fileMessage, deleteMessage) => {
          // Navigate to media viewer
          navigation.navigate(Routes.FileViewer, {
            serializedFileMessage: fileMessage.serialize(),
            deleteMessage,
          });
        }}
        onChannelDeleted={() => {
          // Should leave channel, navigate to channel list
          if (channel.customType.includes(OpenChannelCustomType.LIVE)) {
            navigation.navigate(Routes.OpenChannelListLiveStreams);
          } else if (channel.customType.includes(OpenChannelCustomType.COMMUNITY)) {
            navigation.navigate(Routes.OpenChannelListCommunity);
          } else {
            navigation.navigate(Routes.OpenChannelTabs);
          }
        }}
        onPressHeaderLeft={() => {
          // Navigate back
          navigation.goBack();
        }}
        onPressHeaderRightWithSettings={() => {
          // Navigate to open channel settings
          navigation.push(Routes.OpenChannelSettings, params);
        }}
        onPressHeaderRightWithParticipants={() => {
          // Navigate to open channel participants
          navigation.push(Routes.OpenChannelParticipants, params);
        }}
      />
    </Box>
  );
};

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
  },
  avatarGroup: {
    marginRight: 8,
  },
  subtitle: {
    marginTop: 2,
  },
});

export default OpenChannelLiveStreamScreen;
