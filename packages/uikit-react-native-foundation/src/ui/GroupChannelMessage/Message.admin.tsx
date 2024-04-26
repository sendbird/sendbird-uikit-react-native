import React, { useContext } from 'react';

import type { SendbirdAdminMessage } from '@gathertown/uikit-utils';

import Box from '../../components/Box';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { GroupChannelMessageProps } from './index';
import { CustomComponentContext } from '../../context/CustomComponentCtx';

export type AdminMessageRenderProp = (props: { message: string }) => React.ReactElement;

const AdminMessage = (props: GroupChannelMessageProps<SendbirdAdminMessage>) => {
  const { colors } = useUIKitTheme();
  const ctx = useContext(CustomComponentContext);

  if (ctx?.renderAdminMessage) {
    return ctx.renderAdminMessage({ message: props.message.message });
  }

  return (
    <Box style={styles.container}>
      <Text caption2 color={colors.onBackground02} style={styles.text}>
        {props.message.message}
      </Text>
    </Box>
  );
};

const styles = createStyleSheet({
  container: {
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default AdminMessage;
