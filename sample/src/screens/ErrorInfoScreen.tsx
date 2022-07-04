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
        bounces={false}
        style={{ width: '80%', maxHeight: 400, borderRadius: 8, marginBottom: 16 }}
        contentContainerStyle={{ backgroundColor: Palette.background100 }}
        stickySectionHeadersEnabled
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
