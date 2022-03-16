import React, { useContext } from 'react';
import { View } from 'react-native';

import { Header as DefaultHeader, Icon, Text } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelContext } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelHeader: React.FC<GroupChannelProps['Header']> = ({ Header = DefaultHeader, onPressHeaderLeft }) => {
  const { headerTitle } = useContext(GroupChannelContext.Fragment);
  if (!Header) return null;
  return (
    <Header
      title={
        <View>
          <Text>{headerTitle}</Text>
        </View>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={'info'} />}
    />
  );
};

export default GroupChannelHeader;
