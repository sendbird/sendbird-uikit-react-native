import type React from 'react';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdOpenChannel, SendbirdParticipant, SendbirdUser } from '@sendbird/uikit-utils';

import type { UserListProps } from '../userList/types';

export interface OpenChannelParticipantsProps {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: () => void;
    renderUser?: UserListProps<SendbirdParticipant>['List']['renderUser'];
    // NOTE: SDK does not migrate the response type of query to Participant from User yet due to backward compat.
    queryCreator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['queryCreator'];
    sortComparator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['sortComparator'];
  };
}
export type OpenChannelParticipantsFragment = React.FC<OpenChannelParticipantsProps['Fragment']>;

export interface OpenChannelRegisterOperatorProps {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: (channel: SendbirdOpenChannel) => void;
    renderUser?: UserListProps<SendbirdParticipant>['List']['renderUser'];
    // NOTE: SDK does not migrate the response type of query to Participant from User yet due to backward compat.
    queryCreator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['queryCreator'];
    sortComparator?: UseUserListOptions<SendbirdUser | SendbirdParticipant>['sortComparator'];
  };
}
export type OpenChannelRegisterOperatorFragment = React.FC<OpenChannelRegisterOperatorProps['Fragment']>;
