import React, { useContext, useEffect } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';

import { Icon, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import createStyleSheet from '@sendbird/uikit-react-native-foundation/src/utils/createStyleSheet';

import { useLocalization } from '../../../contexts/Localization';
import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps, GroupChannelType } from '../types';

const TYPES: GroupChannelType[] = ['GROUP', 'SUPER_GROUP', 'BROADCAST'];
const groupChannelTypeIconMap = { 'GROUP': 'chat', 'SUPER_GROUP': 'supergroup', 'BROADCAST': 'broadcast' } as const;

export const DefaultTypeIcon: React.FC<{ type: GroupChannelType }> = ({ type }) => {
  return <Icon size={24} icon={groupChannelTypeIconMap[type]} containerStyle={{ marginBottom: 8 }} />;
};

export const DefaultTypeText: React.FC<{ type: GroupChannelType }> = ({ type }) => {
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();
  return (
    <Text caption2 color={colors.onBackground01}>
      {LABEL.GROUP_CHANNEL_LIST.TYPE_SELECTOR[type]}
    </Text>
  );
};

const GroupChannelListTypeSelector: React.FC<GroupChannelListProps['TypeSelector']> = ({
  Header,
  skipTypeSelection,
  onSelectType,
  statusBarTranslucent,
}) => {
  const { typeSelector } = useContext(GroupChannelListContext);
  const { visible, hide } = typeSelector;
  const createOnPressType = (type: GroupChannelType) => () => {
    hide();
    onSelectType(type);
  };

  useEffect(() => {
    if (skipTypeSelection && visible) createOnPressType('GROUP')();
  }, [skipTypeSelection, visible]);

  if (skipTypeSelection) return null;

  return (
    <Modal visible={visible} animationType={'fade'} transparent statusBarTranslucent={statusBarTranslucent}>
      <View style={styles.container}>
        <Header>
          <View style={styles.buttonArea}>
            {TYPES.map((type) => {
              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.6}
                  onPress={createOnPressType(type)}
                  style={styles.typeButton}
                >
                  <DefaultTypeIcon type={type} />
                  <DefaultTypeText type={type} />
                </TouchableOpacity>
              );
            })}
          </View>
        </Header>
        <Pressable style={{ flex: 1 }} onPress={hide} />
      </View>
    </Modal>
  );
};

const styles = createStyleSheet({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  buttonArea: {
    flexDirection: 'row',
  },
  typeButton: {
    paddingVertical: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroupChannelListTypeSelector;
