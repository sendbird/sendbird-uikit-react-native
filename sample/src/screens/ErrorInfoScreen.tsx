import React from 'react';
import { SectionList, View } from 'react-native';

import type { ErrorBoundaryProps } from '@sendbird/uikit-react-native';
import { Button, Palette, Text } from '@sendbird/uikit-react-native-foundation';

const ErrorInfoScreen = (props: ErrorBoundaryProps) => {
  const renderHeader = (props: { section: { title: string } }) => (
    <Text
      body2
      color={Palette.onBackgroundLight01}
      style={{ backgroundColor: Palette.background300, paddingHorizontal: 8, paddingVertical: 4 }}
    >
      {props.section.title}
    </Text>
  );
  const renderItem = (props: { item?: string }) => (
    <Text caption2 color={Palette.onBackgroundLight02} style={{ padding: 12 }}>
      {props.item}
    </Text>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SectionList
        style={{
          backgroundColor: Palette.background100,
          maxHeight: 400,
          maxWidth: '80%',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 16,
        }}
        sections={[
          {
            title: 'Error name',
            data: [props.error.name],
            renderItem,
          },
          {
            title: 'Error message',
            data: [props.error.message],
            renderItem,
          },
          {
            title: 'Error stack',
            data: [props.error.stack],
            renderItem,
          },
          {
            title: 'Error info',
            data: [props.errorInfo.componentStack],
            renderItem,
          },
        ]}
        renderSectionHeader={renderHeader}
      />
      <Button onPress={props.reset} style={{ width: '80%' }}>
        {'Reset'}
      </Button>
    </View>
  );
};

export default ErrorInfoScreen;
