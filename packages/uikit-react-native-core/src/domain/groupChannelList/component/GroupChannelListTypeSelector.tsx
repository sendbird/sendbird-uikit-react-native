import React, { useContext, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';

import {
  Header as DefaultHeader,
  Icon,
  Modal,
  Text,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../contexts/Localization';
import { GroupChannelListContexts } from '../module/moduleContext';
import type { GroupChannelListProps, GroupChannelType } from '../types';

const TYPES: GroupChannelType[] = ['GROUP', 'SUPER_GROUP', 'BROADCAST'];
const TYPE_ICONS: Record<GroupChannelType, keyof typeof Icon.Assets> = {
  'GROUP': 'chat',
  'SUPER_GROUP': 'supergroup',
  'BROADCAST': 'broadcast',
};

const GroupChannelListTypeSelector: React.FC<GroupChannelListProps['TypeSelector']> = ({
  Header = DefaultHeader,
  skipTypeSelection,
  onSelectType,
}) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const typeSelector = useContext(GroupChannelListContexts.TypeSelector);
  const { visible, hide } = typeSelector;
  const createOnPressType = (type: GroupChannelType) => () => {
    hide();
    onSelectType(type);
  };

  useEffect(() => {
    if (skipTypeSelection && visible) createOnPressType('GROUP')();
  }, [skipTypeSelection, visible]);

  if (skipTypeSelection) return null;

  const renderButtons = () => (
    <View style={styles.buttonArea}>
      {TYPES.map((type) => {
        return (
          <TouchableOpacity key={type} activeOpacity={0.6} onPress={createOnPressType(type)} style={styles.typeButton}>
            <DefaultTypeIcon type={type} />
            <DefaultTypeText type={type} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderHeader = () => {
    if (Header) {
      return (
        <Header
          title={typeSelector.headerTitle}
          right={<Icon icon={'close'} color={colors.onBackground01} />}
          onPressRight={typeSelector.hide}
        >
          {renderButtons()}
        </Header>
      );
    }

    return (
      <DefaultHeader title={null} right={null} left={null}>
        {renderButtons()}
      </DefaultHeader>
    );
  };

  return (
    <Modal visible={visible} onClose={hide} statusBarTranslucent={statusBarTranslucent}>
      {renderHeader()}
    </Modal>
  );
};

const DefaultTypeIcon: React.FC<{ type: GroupChannelType }> = ({ type }) => {
  return <Icon size={24} icon={TYPE_ICONS[type]} containerStyle={styles.icon} />;
};

const DefaultTypeText: React.FC<{ type: GroupChannelType }> = ({ type }) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  return (
    <Text caption2 color={colors.onBackground01}>
      {STRINGS.GROUP_CHANNEL_LIST[`TYPE_SELECTOR_${type}`]}
    </Text>
  );
};

const styles = createStyleSheet({
  buttonArea: {
    flexDirection: 'row',
  },
  typeButton: {
    paddingVertical: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 8,
  },
});

export default GroupChannelListTypeSelector;
