import React, { useCallback, useContext, useReducer, useRef, useState } from 'react';

import type { SendbirdBaseChannel, SendbirdBaseMessage } from '@sendbird/uikit-utils';
import { NOOP } from '@sendbird/uikit-utils';

import { ReactionBottomSheets } from '../components/ReactionBottomSheets';
import { LocalizationContext } from '../contexts/LocalizationCtx';
import { SendbirdChatContext } from '../contexts/SendbirdChatCtx';
import { UserProfileContext } from '../contexts/UserProfileCtx';

type State = {
  message?: SendbirdBaseMessage;
  channel?: SendbirdBaseChannel;
};
export type ReactionContextType = {
  openReactionList(param: Required<State>): void;
  openReactionUserList(param: Required<State> & { focusIndex?: number }): void;
  updateReactionFocusedItem(param?: State): void;
  focusIndex: number;
} & State;

type Props = React.PropsWithChildren<{}>;

export const ReactionContext = React.createContext<ReactionContextType | null>(null);
export const ReactionProvider = ({ children }: Props) => {
  const chatCtx = useContext(SendbirdChatContext);
  const localizationCtx = useContext(LocalizationContext);
  const userProfileCtx = useContext(UserProfileContext);
  if (!chatCtx) throw new Error('SendbirdChatContext is not provided');
  if (!localizationCtx) throw new Error('LocalizationContext is not provided');
  if (!userProfileCtx) throw new Error('UserProfileContext is not provided');

  const [state, setState] = useReducer((prev: State, next: State) => ({ ...prev, ...next }), {});
  const [reactionListVisible, setReactionListVisible] = useState(false);
  const [reactionUserListVisible, setReactionUserListVisible] = useState(false);
  const [reactionUserListFocusIndex, setReactionUserListFocusIndex] = useState(0);

  const closeResolver = useRef<() => void>(NOOP);

  const openReactionList: ReactionContextType['openReactionList'] = useCallback((params) => {
    setState(params);
    setReactionListVisible(true);
  }, []);

  const openReactionUserList: ReactionContextType['openReactionUserList'] = useCallback(
    ({ channel, message, focusIndex = 0 }) => {
      setState({ channel, message });
      setReactionUserListFocusIndex(focusIndex);
      setReactionUserListVisible(true);
    },
    [],
  );

  const updateReactionFocusedItem: ReactionContextType['updateReactionFocusedItem'] = useCallback((params) => {
    if (params) setState(params);
    else setState({});
  }, []);

  const createOnCloseWithResolver = (callback: () => void) => {
    return () => {
      return new Promise<void>((resolve) => {
        closeResolver.current = resolve;
        callback();
      });
    };
  };

  const reactionCtx = {
    ...state,
    openReactionList,
    openReactionUserList,
    updateReactionFocusedItem,
    focusIndex: reactionUserListFocusIndex,
  };

  const sheetProps = {
    chatCtx,
    reactionCtx,
    localizationCtx,
    userProfileCtx,
    onDismiss: () => {
      setState({});
      closeResolver.current?.();
    },
  };

  return (
    <ReactionContext.Provider value={reactionCtx}>
      {children}
      <ReactionBottomSheets.UserList
        {...sheetProps}
        visible={reactionUserListVisible}
        onClose={createOnCloseWithResolver(() => setReactionUserListVisible(false))}
      />
      <ReactionBottomSheets.ReactionList
        {...sheetProps}
        visible={reactionListVisible}
        onClose={createOnCloseWithResolver(() => setReactionListVisible(false))}
      />
    </ReactionContext.Provider>
  );
};
