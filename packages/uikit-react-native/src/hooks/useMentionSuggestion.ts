import { useCallback, useRef, useState } from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import type { SendbirdChatSDK, SendbirdGroupChannel, SendbirdMember, SendbirdUser } from '@sendbird/uikit-utils';
import { isDifferentChannel, useAsyncEffect, useDebounceEffect, useUniqHandlerId } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../hooks/useContext';
import type { Range } from '../types';

const useMentionSuggestion = (params: {
  text: string;
  selection: Range;
  mentionedUsers: { user: SendbirdUser; range: Range }[];
  sdk: SendbirdChatSDK;
  channel: SendbirdGroupChannel;
}) => {
  const { text, selection, channel, mentionedUsers } = params;

  const [freshChannel, setFreshChannel] = useState(channel);

  useAsyncEffect(async () => {
    setFreshChannel(await channel.refresh());
  }, [channel.url]);

  const id = useUniqHandlerId('useMentionSuggestion');

  useChannelHandler(params.sdk, id, {
    onUserJoined(eventChannel) {
      if (isDifferentChannel(eventChannel, channel)) return;
      setFreshChannel(eventChannel);
    },
    onUserLeft(eventChannel) {
      if (isDifferentChannel(eventChannel, channel)) return;
      setFreshChannel(eventChannel);
    },
    onUserBanned(eventChannel) {
      if (isDifferentChannel(eventChannel, channel)) return;
      if (!eventChannel.isGroupChannel()) return;
      setFreshChannel(eventChannel);
    },
  });

  const { mentionManager, currentUser } = useSendbirdChat();
  const [members, setMembers] = useState<SendbirdMember[]>([]);

  const searchStringRangeRef = useRef<Range>({ start: 0, end: 0 });
  const searchLimitedRef = useRef(false);

  const updateSearchStringRange = (selectionIndex: number, searchString: string) => {
    searchStringRangeRef.current = mentionManager.getSearchStringRangeInText(selectionIndex, searchString);
    return searchStringRangeRef.current;
  };
  const updateSearchLimited = (mentionCount: number, mentionLimit: number) => {
    searchLimitedRef.current = mentionCount >= mentionLimit;
    return searchLimitedRef.current;
  };
  const resetRefs = () => {
    searchLimitedRef.current = false;
    searchStringRangeRef.current = { start: 0, end: 0 };
  };

  const fetchMembers = async (): Promise<SendbirdMember[]> => {
    resetRefs();

    const selectionRanged = selection.start !== selection.end;
    if (selectionRanged) return [];

    const selectionContainsMentionedUser = mentionedUsers.some((it) =>
      mentionManager.rangeHelpers.overlaps(it.range, selection, 'underMore'),
    );
    if (selectionContainsMentionedUser) return [];

    const { isTriggered, isValidSearchString, searchString } = mentionManager.getSearchString(text, selection.start);
    if (!isTriggered() || !isValidSearchString()) return [];

    const limited = updateSearchLimited(mentionedUsers.length, mentionManager.config.mentionLimit);
    if (limited) return [];

    updateSearchStringRange(selection.start, searchString);

    if (freshChannel.isSuper) {
      return freshChannel
        .createMemberListQuery({
          nicknameStartsWithFilter: searchString,
          limit: mentionManager.config.suggestionLimit + 1,
        })
        .next()
        .then((members) => members.filter((member) => member.userId !== currentUser?.userId))
        .then((members) => members.slice(0, mentionManager.config.suggestionLimit));
    } else {
      return (
        freshChannel.members
          // NOTE: When using 'org.webkit:android-jsc', there is a problem with sorting lists that include words starting with uppercase and lowercase letters.
          // To ensure consistent sorting regardless of the JSC, we compare the words in lowercase.
          .sort((a, b) => a.nickname?.toLowerCase().localeCompare(b.nickname.toLowerCase()))
          .filter(
            (member) =>
              member.nickname?.toLowerCase().startsWith(searchString.toLowerCase()) &&
              member.userId !== currentUser?.userId &&
              member.isActive,
          )
          .slice(0, mentionManager.config.suggestionLimit)
      );
    }
  };

  useDebounceEffect(
    () => {
      return fetchMembers()
        .then(setMembers)
        .catch(() => setMembers([]));
    },
    mentionManager.config.debounceMills,
    [text, selection],
  );

  return {
    members,
    reset: useCallback(() => setMembers([]), []),
    searchStringRange: searchStringRangeRef.current,
    searchLimited: searchLimitedRef.current,
  };
};

export default useMentionSuggestion;
