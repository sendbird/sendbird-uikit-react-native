import React from 'react';

import { useOpenChannelList } from '@sendbird/uikit-chat-hooks';
import { OpenChannelPreview, PressBox } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import { createOpenChannelListModule } from '../domain/openChannelList';
import type {
  OpenChannelListFragment,
  OpenChannelListModule,
  OpenChannelListProps,
} from '../domain/openChannelList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createOpenChannelListFragment = (initModule?: Partial<OpenChannelListModule>): OpenChannelListFragment => {
  const OpenChannelListModule = createOpenChannelListModule(initModule);

  return ({ onPressCreateChannel, onPressChannel = NOOP, flatListProps, renderOpenChannelPreview, queryCreator }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { openChannels, next, refresh, refreshing, loading, error } = useOpenChannelList(sdk, currentUser?.userId, {
      queryCreator,
    });

    const _renderOpenChannelPreview: OpenChannelListProps['List']['renderOpenChannelPreview'] = (props) => {
      if (renderOpenChannelPreview) return renderOpenChannelPreview(props);
      return (
        <PressBox activeOpacity={0.8} onPress={props.onPress}>
          <OpenChannelPreview
            coverUrl={props.channel.coverUrl}
            title={STRINGS.OPEN_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE(props.channel)}
            frozen={props.channel.isFrozen}
            participantsCount={props.channel.participantCount}
          />
        </PressBox>
      );
    };

    return (
      <OpenChannelListModule.Provider>
        <OpenChannelListModule.Header onPressHeaderRight={onPressCreateChannel} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<OpenChannelListModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<OpenChannelListModule.StatusError onPressRetry={refresh} />}
        >
          <OpenChannelListModule.List
            onPressChannel={onPressChannel}
            renderOpenChannelPreview={_renderOpenChannelPreview}
            openChannels={openChannels}
            onLoadNext={next}
            refreshing={refreshing}
            onRefresh={refresh}
            flatListProps={{
              ListEmptyComponent: <OpenChannelListModule.StatusEmpty />,
              contentContainerStyle: { flexGrow: 1 },
              ...flatListProps,
            }}
          />
        </StatusComposition>
      </OpenChannelListModule.Provider>
    );
  };
};

export default createOpenChannelListFragment;
