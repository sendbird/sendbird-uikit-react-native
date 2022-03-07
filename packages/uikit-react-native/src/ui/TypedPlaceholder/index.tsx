import React from 'react';

import { useLocalization } from '@sendbird/uikit-react-native-core';
import Placeholder from '@sendbird/uikit-react-native-foundation/src/ui/Placeholder';

type Props = {
  type:
    | 'no-banned-members'
    | 'no-channels'
    | 'no-messages'
    | 'no-muted-members'
    | 'no-results-found'
    | 'error-wrong'
    | 'loading';
};
const TypedPlaceholder: React.FC<Props> = ({ type }) => {
  const { LABEL } = useLocalization();
  switch (type) {
    case 'no-banned-members':
      return <Placeholder icon={'ban'} message={LABEL.PLACEHOLDER.NO_BANNED_MEMBERS} />;
    case 'no-channels':
      return <Placeholder icon={'chat'} message={LABEL.PLACEHOLDER.NO_BANNED_MEMBERS} />;
    case 'no-messages':
      return <Placeholder icon={'message'} message={LABEL.PLACEHOLDER.NO_BANNED_MEMBERS} />;
    case 'no-muted-members':
      return <Placeholder icon={'mute'} message={LABEL.PLACEHOLDER.NO_BANNED_MEMBERS} />;
    case 'no-results-found':
      return <Placeholder icon={'search'} message={LABEL.PLACEHOLDER.NO_BANNED_MEMBERS} />;
    case 'error-wrong':
      return (
        <Placeholder
          icon={'error'}
          message={LABEL.PLACEHOLDER.ERROR_SOMETHING_IS_WRONG.MESSAGE}
          errorRetryLabel={LABEL.PLACEHOLDER.ERROR_SOMETHING_IS_WRONG.RETRY_LABEL}
        />
      );
    case 'loading':
      return <Placeholder loading icon={'spinner'} />;
  }
};

export default TypedPlaceholder;
