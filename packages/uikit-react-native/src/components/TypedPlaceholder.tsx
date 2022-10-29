import React from 'react';

import { Placeholder } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../hooks/useContext';

type Props = {
  type:
    | 'no-muted-members'
    | 'no-banned-users'
    | 'no-channels'
    | 'no-messages'
    | 'no-users'
    | 'no-results-found'
    | 'error-wrong'
    | 'loading';
  onPressRetry?: () => void;
};
const TypedPlaceholder = ({ type, onPressRetry }: Props) => {
  const { STRINGS } = useLocalization();
  switch (type) {
    case 'no-banned-users':
      return <Placeholder icon={'ban'} message={STRINGS.PLACEHOLDER.NO_BANNED_USERS} />;
    case 'no-channels':
      return <Placeholder icon={'chat'} message={STRINGS.PLACEHOLDER.NO_CHANNELS} />;
    case 'no-messages':
      return <Placeholder icon={'message'} message={STRINGS.PLACEHOLDER.NO_MESSAGES} />;
    case 'no-muted-members':
      return <Placeholder icon={'mute'} message={STRINGS.PLACEHOLDER.NO_MUTED_MEMBERS} />;
    case 'no-results-found':
      return <Placeholder icon={'search'} message={STRINGS.PLACEHOLDER.NO_RESULTS_FOUND} />;
    case 'no-users':
      return <Placeholder icon={'members'} message={STRINGS.PLACEHOLDER.NO_USERS} />;
    case 'error-wrong':
      return (
        <Placeholder
          icon={'error'}
          message={STRINGS.PLACEHOLDER.ERROR.MESSAGE}
          errorRetryLabel={STRINGS.PLACEHOLDER.ERROR.RETRY_LABEL}
          onPressRetry={onPressRetry}
        />
      );
    case 'loading':
      return <Placeholder loading icon={'spinner'} />;
  }
};

export default TypedPlaceholder;
