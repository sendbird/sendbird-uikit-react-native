import React from 'react';

const CustomHeader = () => <></>;

/**
 * Create a module
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/module#2-create-a-module}
 * */
import { createGroupChannelModule } from '@gathertown/uikit-react-native';
const GroupChannelModule = createGroupChannelModule();

const RenderModule = () => {
  return (
    // @ts-ignore
    <GroupChannelModule.Provider>
      {/* @ts-ignore */}
      <GroupChannelModule.Header />
      {/* @ts-ignore */}
      <GroupChannelModule.MessageList />
      {/* @ts-ignore */}
      <GroupChannelModule.Input />
    </GroupChannelModule.Provider>
  );
};
/** ------------------ **/

/**
 * Customize a module
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/module#2-customize-a-module}
 * */
import { createGroupChannelFragment } from '@gathertown/uikit-react-native';

const GroupChannelModule2 = createGroupChannelModule({ Header: CustomHeader });

// Or use the following code.
const GroupChannelFragment = createGroupChannelFragment({ Header: CustomHeader });
/** ------------------ **/

/**
 * Customize a module component
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/module#2-customize-a-module-3-customize-a-module-component}
 * */
import { Text } from 'react-native';
import type { GroupChannelProps } from '@gathertown/uikit-react-native';

const MyHeader = (_: GroupChannelProps['Header']) => {
  // props.onPressHeaderLeft
  // props.onPressHeaderRight
  return <Text>{'MyHeader'}</Text>;
};
/** ------------------ **/
