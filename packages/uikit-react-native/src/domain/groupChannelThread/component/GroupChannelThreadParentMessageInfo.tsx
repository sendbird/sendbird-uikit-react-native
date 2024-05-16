import React, { useContext } from 'react';
import { View } from 'react-native';

import { Avatar, createStyleSheet, Divider, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelThreadProps } from '../types';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import { format } from 'date-fns';

const GroupChannelThreadParentMessageInfo = (_: GroupChannelThreadProps['ParentMessageInfo']) => {
  const { parentMessage } = useContext(GroupChannelThreadContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage.incoming;
  
  const nickName = parentMessage.sender?.nickname || STRINGS.LABELS.USER_NO_NAME;
  const messageTimestamp = format(new Date(parentMessage.updatedAt), 'MMM dd \'at\' h:mm a');
  
  // const renderItem: GroupChannelThreadProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
  //   const content = <GroupChannelMessageRenderer {...props} />;
  //   return (
  //     <Box>
  //       {content}
  //     </Box>
  //   );
  // });
  
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Avatar size={34} uri={parentMessage.sender?.profileUrl} />
          <View style={styles.userNickAndTimeContainer}>
            <Text h2 numberOfLines={1} style={styles.userNickname}>{nickName}</Text>
            <Text caption4 color={color.enabled.textTime} style={styles.messageTime}>{messageTimestamp}</Text>
          </View>
        </View>
      </View>
      <View style={styles.messageContainer}>
        <View style={styles.reactionButtonContainer}>
        </View>
      </View>
      <Divider />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'column',
  },
  userContainer: {
    flexDirection: 'row',
    height: 50,
    padding: 16,
    paddingBottom: 0,
  },
  userAvatar: {
    width: 36,
    height: 36,
  },
  userNickAndTimeContainer: {
    flexDirection: 'column',
    marginLeft: 8,
  },
  userNickname: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  messageTime: {
    flexDirection: 'row',
    marginTop: 2,
  },
  messageContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 10,
  },
  reactionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(GroupChannelThreadParentMessageInfo);
