import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import type { OpenChannel } from '@sendbird/chat/openChannel';
import { createOpenChannelListFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { createOpenChannelListModule } from '@sendbird/uikit-react-native';
import {
  Avatar,
  Box,
  Image,
  PressBox,
  Text,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import { OpenChannelCustomType, parseStreamData } from '../../../../libs/openChannel';

const BasicOpenChannelListModule = createOpenChannelListModule();
const OpenChannelListFragment = createOpenChannelListFragment({
  Header: () => {
    const { HeaderComponent } = useHeaderStyle();
    return <HeaderComponent title={'Live streams'} />;
  },
  List: (props) => {
    const { colors } = useUIKitTheme();
    return (
      <Box flex={1}>
        <Text body2 color={colors.onBackground02} style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
          {'Preset channels developed by UIKit'}
        </Text>
        <BasicOpenChannelListModule.List {...props} />
      </Box>
    );
  },
});
const OpenChannelListLiveStreamsScreen = () => {
  const { navigation } = useAppNavigation<Routes.OpenChannelListLiveStreams>();
  const { sdk } = useSendbirdChat();

  const navigateToCreateOpenChannel = () => {
    // Navigating to open channel create
    // navigation.navigate(Routes.OpenChannelCreate)
  };

  const navigateToOpenChannel = (channel: SendbirdOpenChannel) => {
    // Navigating to open channel
    navigation.navigate(Routes.OpenChannelLiveStream, { channelUrl: channel.url });
  };

  return (
    <OpenChannelListFragment
      onPressCreateChannel={navigateToCreateOpenChannel}
      onPressChannel={navigateToOpenChannel}
      queryCreator={() => {
        return sdk.openChannel.createOpenChannelListQuery({
          customTypes: [OpenChannelCustomType.LIVE],
        });
      }}
      renderOpenChannelPreview={useCallback(
        (props: { channel: OpenChannel }) => (
          <PressBox onPress={() => navigateToOpenChannel(props.channel)}>
            <LiveStreamPreview {...props} />
          </PressBox>
        ),
        [],
      )}
      flatListProps={{ bounces: false, onRefresh: undefined }}
    />
  );
};

const LiveStreamPreview = ({ channel }: { channel: SendbirdOpenChannel }) => {
  const streamData = parseStreamData(channel.data);
  const { colors, palette } = useUIKitTheme();

  if (!streamData) return null;

  return (
    <Box flexDirection={'row'} paddingVertical={12} paddingHorizontal={16}>
      <Box width={120} height={72} backgroundColor={colors.onBackground04}>
        <Image resizeMode={'cover'} source={{ uri: streamData.live_channel_url }} style={StyleSheet.absoluteFill} />
        <Box
          backgroundColor={colors.error}
          width={10}
          height={10}
          borderRadius={5}
          style={{ position: 'absolute', left: 4, bottom: 4 }}
        />
        <Text caption1 color={palette.onBackgroundDark01} style={{ position: 'absolute', left: 18, bottom: 1 }}>
          {channel.participantCount}
        </Text>
      </Box>
      <Box marginLeft={16} flexShrink={1}>
        <Box flexDirection={'row'} marginBottom={6}>
          <Avatar uri={streamData.thumbnail_url} size={22} containerStyle={{ marginRight: 8 }} />
          <Text subtitle1 color={colors.onBackground01} numberOfLines={1} style={{ flexShrink: 1 }}>
            {streamData.name}
          </Text>
        </Box>
        <Text body3 color={colors.onBackground02} style={{ marginBottom: 4 }}>
          {streamData.creator_info.name}
        </Text>
        <Box flexDirection={'row'} justifyContent={'flex-start'}>
          {streamData.tags.slice(0, 2).map((tag) => {
            return (
              <Box
                backgroundColor={colors.onBackground04}
                key={tag}
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={60}
                marginRight={4}
              >
                <Text caption1 color={colors.onBackground02}>
                  {tag}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default OpenChannelListLiveStreamsScreen;
