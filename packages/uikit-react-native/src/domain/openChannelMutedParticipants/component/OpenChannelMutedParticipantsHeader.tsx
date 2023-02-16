import React, { useContext } from 'react';

import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelMutedParticipantsContexts } from '../module/moduleContext';
import type { OpenChannelMutedParticipantsProps } from '../types';

const OpenChannelMutedParticipantsHeader = ({ onPressHeaderLeft }: OpenChannelMutedParticipantsProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelMutedParticipantsContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  return <HeaderComponent title={headerTitle} left={<Icon icon={'arrow-left'} />} onPressLeft={onPressHeaderLeft} />;
};

export default OpenChannelMutedParticipantsHeader;
