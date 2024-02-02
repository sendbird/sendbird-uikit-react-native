import type React from 'react';

import type { OnBeforeHandler, SendbirdOpenChannel, SendbirdOpenChannelCreateParams } from '@sendbird/uikit-utils';

import type { FileType } from '../../platform/types';
import type { CommonComponent } from '../../types';

export type OpenChannelCreateProps = {
  Fragment: {
    onPressHeaderLeft: OpenChannelCreateProps['Header']['onPressHeaderLeft'];
    onCreateChannel: (channel: SendbirdOpenChannel) => void;
    onBeforeCreateChannel?: OnBeforeHandler<SendbirdOpenChannelCreateParams>;
  };
  Header: {
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
    shouldActivateHeaderRight: () => boolean;
  };
  ProfileInput: {
    channelName: string;
    onChangeChannelName: (val: OpenChannelCreateProps['ProfileInput']['channelName']) => void;
    channelCoverFile: FileType | undefined;
    onChangeChannelCoverFile: (val: OpenChannelCreateProps['ProfileInput']['channelCoverFile']) => void;
  };
};

/**
 * Internal context for OpenChannelCreate
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelCreateContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    headerRight: string;
  }>;
};
export interface OpenChannelCreateModule {
  Provider: CommonComponent;
  Header: CommonComponent<OpenChannelCreateProps['Header']>;
  ProfileInput: CommonComponent<OpenChannelCreateProps['ProfileInput']>;
  StatusLoading: CommonComponent;
}

export type OpenChannelCreateFragment = React.FC<OpenChannelCreateProps['Fragment']>;
