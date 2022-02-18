import React, { useCallback, useContext } from 'react';
import { Pressable, View } from 'react-native';
import type Sendbird from 'sendbird';

import { useGroupChannelList } from '@sendbird/chat-react-hooks';
import type {
  GroupChannelListFragment,
  GroupChannelListModule,
  GroupChannelListProps,
  GroupChannelType,
} from '@sendbird/uikit-react-native-core';
import {
  GroupChannelListContext,
  createGroupChannelListModule,
  useLocalization,
  useSendbirdChat,
} from '@sendbird/uikit-react-native-core';
import { Logger, channelComparator } from '@sendbird/uikit-utils';

import useHeaderStyle from '../styles/useHeaderStyle';
import useUIKitTheme from '../theme/useUIKitTheme';
import GroupChannelPreview from '../ui/GroupChannelPreview';
import DefaultHeader from '../ui/Header';
import Icon from '../ui/Icon';
import Text from '../ui/Text';

const groupChannelTypeIconMap = { 'GROUP': 'chat', 'SUPER_GROUP': 'supergroup', 'BROADCAST': 'broadcast' } as const;
export const DefaultTypeIcon: React.FC<{ type: GroupChannelType }> = ({ type }) => {
  return <Icon size={24} icon={groupChannelTypeIconMap[type]} containerStyle={{ marginBottom: 8 }} />;
};
export const DefaultTypeText: React.FC<{ type: GroupChannelType }> = ({ type }) => {
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();
  return (
    <Text caption2 color={colors.onBackground01}>
      {LABEL.GROUP_CHANNEL_LIST.TYPE_SELECTOR[type]}
    </Text>
  );
};

export const DefaultFragmentHeader: React.FC<{ Header: GroupChannelListProps['Fragment']['FragmentHeader'] }> = ({
  Header,
}) => {
  const { fragment, typeSelector } = useContext(GroupChannelListContext);
  if (!Header) return null;
  return <Header title={fragment.headerTitle} right={<Icon icon={'create'} />} onPressRight={typeSelector.show} />;
};
export const DefaultTypeSelectorHeader: React.FC<{
  Header: GroupChannelListProps['Fragment']['TypeSelectorHeader'];
}> = ({ Header, children }) => {
  const { typeSelector } = useContext(GroupChannelListContext);
  const { colors } = useUIKitTheme();
  const { topInset } = useHeaderStyle();

  if (!Header) {
    return <View style={{ paddingTop: topInset, backgroundColor: colors.ui.header.background }}>{children}</View>;
  }
  return (
    <Header
      title={typeSelector.headerTitle}
      right={<Icon icon={'close'} color={colors.onBackground01} />}
      onPressRight={typeSelector.hide}
    >
      {children}
    </Header>
  );
};

const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const GroupChannelListModule = createGroupChannelListModule(initModule);
  return ({
    FragmentHeader = DefaultHeader,
    TypeSelectorHeader = DefaultHeader,
    onPressChannel,
    onPressCreateChannel,
    queryFactory,
    sortComparator = channelComparator,
    skipTypeSelection = true,
    children,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { groupChannels, refresh, refreshing, loadMore } = useGroupChannelList(sdk, currentUser?.userId, {
      queryFactory,
      sortComparator,
    });

    const { LABEL } = useLocalization();
    const { statusBarTranslucent, topInset } = useHeaderStyle();

    const renderGroupChannelPreview = useCallback(
      (channel: Sendbird.GroupChannel) => (
        <Pressable onPress={() => onPressChannel(channel)}>
          <GroupChannelPreview
            coverUrl={channel.coverUrl}
            title={LABEL.GROUP_CHANNEL_LIST.FRAGMENT.PREVIEW_TITLE(currentUser?.userId ?? '', channel)}
            titleCaption={LABEL.GROUP_CHANNEL_LIST.FRAGMENT.PREVIEW_TITLE_CAPTION(channel)}
            body={LABEL.GROUP_CHANNEL_LIST.FRAGMENT.PREVIEW_BODY(channel)}
            badgeCount={channel.unreadMessageCount}
            frozen={channel.isFrozen}
            bodyIcon={channel.lastMessage?.isFileMessage() ? 'file-document' : undefined}
            muted={channel.myMutedState === 'muted'}
            memberCount={channel.memberCount}
          />
        </Pressable>
      ),
      [LABEL, onPressChannel, currentUser?.userId],
    );

    if (!currentUser) {
      Logger.warn('Cannot render GroupChannelListFragment, User is not connected');
      return null;
    }

    return (
      <GroupChannelListModule.Provider>
        <DefaultFragmentHeader Header={FragmentHeader} />
        <GroupChannelListModule.List
          refreshing={refreshing}
          renderGroupChannelPreview={renderGroupChannelPreview}
          groupChannels={groupChannels}
          onLoadMore={loadMore}
          onRefresh={refresh}
        />
        <GroupChannelListModule.TypeSelector
          Header={({ children }) => (
            <DefaultTypeSelectorHeader Header={TypeSelectorHeader}>{children}</DefaultTypeSelectorHeader>
          )}
          TypeText={DefaultTypeText}
          TypeIcon={DefaultTypeIcon}
          topInset={topInset}
          skipTypeSelection={skipTypeSelection}
          statusBarTranslucent={statusBarTranslucent}
          onSelectType={onPressCreateChannel}
        />
        {children}
      </GroupChannelListModule.Provider>
    );
  };
};

export default createGroupChannelListFragment;
