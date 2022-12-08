import { useCallback, useEffect, useRef, useState } from 'react';

import type { SendbirdGroupChannel, SendbirdMember } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../hooks/useContext';

const useMentionSuggestion = (params: {
  text: string;
  selection: { start: number; end: number };
  channel: SendbirdGroupChannel;
}) => {
  const { text, selection, channel } = params;

  const { mentionManager, currentUser } = useSendbirdChat();
  const [members, setMembers] = useState<SendbirdMember[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const searchRangeRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const updateSearchRange = (start: number, end: number) => {
    searchRangeRef.current = { start, end };
  };

  const fetchMembers = async (): Promise<SendbirdMember[]> => {
    const selectionRanged = selection.start !== selection.end;
    if (selectionRanged) return [];

    const { isTriggered, isValidSearchString, searchString } = mentionManager.findSearchString(text, selection.start);
    if (!isTriggered() || !isValidSearchString()) return [];

    const { start: ssStart, end: ssEnd } = mentionManager.getSearchStringRangeInText(selection.start, searchString);
    updateSearchRange(ssStart, ssEnd);

    if (channel.isSuper) {
      return channel
        .createMemberListQuery({
          nicknameStartsWithFilter: searchString,
          limit: mentionManager.config.suggestionLimit + 1,
        })
        .next()
        .then((members) => members.filter((member) => member.userId !== currentUser?.userId));
    } else {
      return channel.members
        .sort((a, b) => a.nickname?.localeCompare(b.nickname))
        .filter((member) => member.nickname?.startsWith(searchString) && member.userId !== currentUser?.userId)
        .slice(0, mentionManager.config.suggestionLimit);
    }
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(async () => {
      fetchMembers()
        .then(setMembers)
        .catch(() => setMembers([]))
        .finally(() => (timeoutRef.current = undefined));
    }, mentionManager.config.debounceMills);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, [text, selection]);

  return { members, reset: useCallback(() => setMembers([]), []), searchRange: searchRangeRef.current };
};

export default useMentionSuggestion;
