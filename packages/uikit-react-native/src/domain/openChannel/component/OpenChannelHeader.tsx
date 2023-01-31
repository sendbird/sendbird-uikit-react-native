import React, { useContext } from 'react';

import { useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { OpenChannelContexts } from '../module/moduleContext';
import type { OpenChannelProps } from '../types';
import { useLocalization } from "@sendbird/uikit-react-native";

const OpenChannelHeader = (_: OpenChannelProps['Header']) => {
  const { headerTitle } = useContext(OpenChannelContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  const {STRINGS} = useLocalization();
  return <HeaderComponent title={headerTitle} />;
};

export default OpenChannelHeader;
