import React, { useCallback, useContext, useReducer, useState } from 'react';

import type { SendbirdBaseChannel, SendbirdBaseMessage } from '@sendbird/uikit-utils';

import { ReactionBottomSheets } from '../components/ReactionBottomSheets';
import { SendbirdChatContext } from '../contexts/SendbirdChatCtx';

type State = {
  message?: SendbirdBaseMessage;
  channel?: SendbirdBaseChannel;
};
export type ReactionContextType = {
  openReactionList(param: Required<State>): void;
  openReactionUserList(param: Required<State>): void;
  updateReactionFocusedItem(param?: State): void;
} & State;

type Props = React.PropsWithChildren<{}>;

export const ReactionContext = React.createContext<ReactionContextType | null>(null);
export const ReactionProvider = ({ children }: Props) => {
  const chatCtx = useContext(SendbirdChatContext);
  if (!chatCtx) throw new Error('SendbirdChatContext is not provided');

  const [state, setState] = useReducer((prev: State, next: State) => ({ ...prev, ...next }), {});
  const [reactionListVisible, setReactionListVisible] = useState(false);
  const [reactionUserListVisible, setReactionUserListVisible] = useState(false);

  const openReactionList: ReactionContextType['openReactionList'] = useCallback((params) => {
    setState(params);
    setReactionListVisible(true);
  }, []);

  const openReactionUserList: ReactionContextType['openReactionUserList'] = useCallback((params) => {
    setState(params);
    setReactionUserListVisible(true);
  }, []);

  const updateReactionFocusedItem: ReactionContextType['updateReactionFocusedItem'] = useCallback((params) => {
    if (params) setState(params);
    else setState({});
  }, []);

  return (
    <ReactionContext.Provider
      value={{
        ...state,
        openReactionList,
        openReactionUserList,
        updateReactionFocusedItem,
      }}
    >
      {children}
      <ReactionBottomSheets.UserList
        visible={reactionUserListVisible}
        onDismiss={() => setState({})}
        onClose={() => setReactionUserListVisible(false)}
      />
      <ReactionBottomSheets.ReactionList
        visible={reactionListVisible}
        onDismiss={() => setState({})}
        onClose={() => setReactionListVisible(false)}
      />
    </ReactionContext.Provider>
  );
};
