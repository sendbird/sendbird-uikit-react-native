import { useMemo } from 'react';

import MentionConfig, { MentionConfigInterface } from '../../libs/MentionConfig';
import MentionManager from '../../libs/MentionManager';

export const useMentionManager = (
  enabled: boolean,
  mentionConfig?: Pick<Partial<MentionConfigInterface>, 'mentionLimit' | 'suggestionLimit' | 'debounceMills'>,
) => {
  return useMemo(() => {
    const config = new MentionConfig({
      mentionLimit: mentionConfig?.mentionLimit || MentionConfig.DEFAULT.MENTION_LIMIT,
      suggestionLimit: mentionConfig?.suggestionLimit || MentionConfig.DEFAULT.SUGGESTION_LIMIT,
      debounceMills: mentionConfig?.debounceMills ?? MentionConfig.DEFAULT.DEBOUNCE_MILLS,
      delimiter: MentionConfig.DEFAULT.DELIMITER,
      trigger: MentionConfig.DEFAULT.TRIGGER,
    });
    return new MentionManager(config, enabled);
  }, [enabled, mentionConfig?.mentionLimit, mentionConfig?.suggestionLimit, mentionConfig?.debounceMills]);
};
