import React, { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { isGroupChannelChatUnavailable, useIIFE } from '@sendbird/uikit-utils';

import { GroupChannelContexts } from '../../module/moduleContext';
import type { GroupChannelProps } from '../../types';
import EditInput from './EditInput';
import SendInput from './SendInput';

const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });
const GroupChannelInput = (props: GroupChannelProps['Input']) => {
  const { left, right, bottom } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();
  const { channel, editMessage, setEditMessage, keyboardAvoidOffset = 0 } = useContext(GroupChannelContexts.Fragment);

  const [text, setText] = useState('');
  const textTmpRef = useRef('');
  const isChatUnavailable = isGroupChannelChatUnavailable(channel);

  useEffect(() => {
    if (text.length === 0) channel.endTyping();
    else channel.startTyping();
  }, [text]);

  useEffect(() => {
    if (isChatUnavailable) {
      textTmpRef.current = text;
      setText('');
    } else {
      setText(textTmpRef.current);
    }
  }, [isChatUnavailable]);

  const inputMode = useIIFE(() => {
    if (!editMessage) return 'send';
    if (editMessage.isFileMessage()) return 'send';
    return 'edit';
  });

  if (!props.shouldRenderInput) {
    return <SafeAreaBottom height={bottom} />;
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-bottom + keyboardAvoidOffset}
      behavior={KEYBOARD_AVOID_VIEW_BEHAVIOR}
    >
      <View style={{ paddingLeft: left, paddingRight: right, backgroundColor: colors.background }}>
        <View style={{ justifyContent: 'center', width: '100%' }}>
          {inputMode === 'send' && <SendInput {...props} text={text} setText={setText} disabled={isChatUnavailable} />}
          {inputMode === 'edit' && editMessage && (
            <EditInput
              {...props}
              text={text}
              setText={setText}
              editMessage={editMessage}
              setEditMessage={setEditMessage}
            />
          )}
        </View>
        <SafeAreaBottom height={bottom} />
      </View>
    </KeyboardAvoidingView>
  );
};
const SafeAreaBottom = ({ height }: { height: number }) => {
  return <View style={{ height }} />;
};

export default React.memo(GroupChannelInput);
