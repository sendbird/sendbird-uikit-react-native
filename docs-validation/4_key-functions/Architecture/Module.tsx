import React from 'react';

const CustomHeader = () => <></>;
/**
 * Create a module
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/module#2-create-a-module}
 * */
// TODO: import createGroupChannelModule
const GroupChannelModule = createGroupChannelModule();

const RenderModule = () => {
  return (
    <GroupChannelModule.Provider>
      <GroupChannelModule.Header />
      <GroupChannelModule.MessageList />
      <GroupChannelModule.Input />
    </GroupChannelModule.Provider>
  );
};

/** ------------------ **/

/**
 * Create a module
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/module#2-create-a-module}
 * */
// TODO: import createGroupChannelModule, createGroupChannelFragment
const GroupChannelModule = createGroupChannelModule({ Header: CustomHeader });

// Or use the following code.
const GroupChannelFragment = createGroupChannelFragment({ Header: CustomHeader });

/** ------------------ **/

/**
 * Create a module
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/module#2-create-a-module}
 * */
// TODO: import GroupChannelProps, Text
const CustomHeader = (_: GroupChannelProps['Header']) => {
  // props.onPressHeaderLeft
  // props.onPressHeaderRight
  return <Text>{'CustomHeader'}</Text>;
};
/** ------------------ **/
