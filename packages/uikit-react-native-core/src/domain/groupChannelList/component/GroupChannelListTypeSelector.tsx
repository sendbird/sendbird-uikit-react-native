import React, { useContext, useEffect } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';

import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps, GroupChannelType } from '../types';

const TYPES: GroupChannelType[] = ['GROUP', 'SUPER_GROUP', 'BROADCAST'];
const GroupChannelListTypeSelector: React.FC<GroupChannelListProps['TypeSelector']> = ({
  TypeIcon,
  TypeText,
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
      <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1 }}>
        <Header>
          <View style={{ flexDirection: 'row' }}>
            {TYPES.map((type) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={type}
                  onPress={createOnPressType(type)}
                  style={{ paddingVertical: 24, flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <TypeIcon type={type} />
                  <TypeText type={type} />
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

export default GroupChannelListTypeSelector;
