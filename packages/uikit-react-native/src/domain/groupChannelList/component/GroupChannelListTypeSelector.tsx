import React, { useContext, useEffect } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import {
  Icon,
  Modal,
  Text,
  createStyleSheet,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';

import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelListContexts } from '../module/moduleContext';
import type { GroupChannelListProps, GroupChannelType } from '../types';

const TYPES: GroupChannelType[] = ['GROUP', 'SUPER_GROUP', 'BROADCAST'];
const TYPE_ICONS: Record<GroupChannelType, keyof typeof Icon.Assets> = {
  'GROUP': 'chat',
  'SUPER_GROUP': 'supergroup',
  'BROADCAST': 'broadcast',
};
const STATUS_BAR_TOP_INSET_AS: 'margin' | 'padding' = Platform.select({ android: 'margin', default: 'padding' });

const GroupChannelListTypeSelector = ({ skipTypeSelection, onSelectType }: GroupChannelListProps['TypeSelector']) => {
  const { statusBarTranslucent, HeaderComponent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const { features } = useSendbirdChat();
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

  return (
    <Modal visible={visible} onClose={hide} statusBarTranslucent={statusBarTranslucent}>
      <HeaderComponent
        title={typeSelector.headerTitle}
        right={<Icon icon={'close'} color={colors.onBackground01} />}
        onPressRight={typeSelector.hide}
        statusBarTopInsetAs={STATUS_BAR_TOP_INSET_AS}
      >
        <View style={styles.buttonArea}>
          {TYPES.map((type) => {
            if (type === 'SUPER_GROUP' && !features.superGroupChannelEnabled) {
              return null;
            }

            if (type === 'BROADCAST' && !features.broadcastChannelEnabled) {
              return null;
            }

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
      </HeaderComponent>
    </Modal>
  );
};

const DefaultTypeIcon = ({ type }: { type: GroupChannelType }) => {
  return <Icon size={24} icon={TYPE_ICONS[type]} containerStyle={styles.icon} />;
};

const DefaultTypeText = ({ type }: { type: GroupChannelType }) => {
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
