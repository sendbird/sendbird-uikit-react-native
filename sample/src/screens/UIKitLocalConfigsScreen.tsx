import React, { useContext } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';

import { Icon, Switch, Text } from '@sendbird/uikit-react-native-foundation';

import { UIKitLocalConfigsContext } from '../context/uikitLocalConfigs';

const Divider = () => <View style={{ height: 1, backgroundColor: '#dcdcdc' }} />;

const UIKitLocalConfigsScreen = () => {
  const { localConfigs, setLocalConfigs } = useContext(UIKitLocalConfigsContext);
  return (
    <ScrollView
      style={{ backgroundColor: 'white' }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 20,
        backgroundColor: 'white',
      }}
    >
      <Switchable
        title={'RTL'}
        description={'Right to left, please restart the app to apply the changes'}
        value={localConfigs.rtl}
        onChange={(value) => {
          I18nManager.forceRTL(value);
          setLocalConfigs((prev) => ({ ...prev, rtl: value }));
        }}
      />
      <Divider />

      <Selectable
        title={'Reply Type'}
        value={localConfigs.replyType}
        values={['none', 'thread', 'quote_reply']}
        onChange={(value) => setLocalConfigs((prev) => ({ ...prev, replyType: value }))}
      />
      {localConfigs.replyType === 'thread' && (
        <View style={{ marginStart: 12, flexDirection: 'row' }}>
          <View style={{ width: 4, height: '100%', backgroundColor: '#dcdcdc', marginEnd: 12 }} />
          <Selectable
            title={'Reply Select Type'}
            value={localConfigs.threadReplySelectType}
            values={['thread', 'parent']}
            onChange={(value) => setLocalConfigs((prev) => ({ ...prev, threadReplySelectType: value }))}
          />
        </View>
      )}
    </ScrollView>
  );
};

const Switchable = ({
  title,
  description,
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  title?: string;
  description?: string;
}) => {
  return (
    <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      {!!title && <Text h2>{title}</Text>}
      {!!description && <Text caption2>{description}</Text>}

      <Switch value={value} onChangeValue={onChange} />
    </View>
  );
};

interface SelectableProps<T> {
  value: T;
  values: T[];
  onChange: (value: T) => void;
  title?: string;
}
const Selectable = <T extends string>({ title, values, value, onChange }: SelectableProps<T>) => {
  return (
    <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      {!!title && <Text h2>{title}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {values.map((v) => (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginEnd: 8 }}
          >
            <Icon icon={value === v ? 'checkbox-on' : 'checkbox-off'} size={24} />
            <Text caption1>{v}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default UIKitLocalConfigsScreen;
