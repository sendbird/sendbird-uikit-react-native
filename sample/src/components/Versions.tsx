import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Text } from '@sendbird/uikit-react-native-foundation';

import useVersions from '../hooks/useVersions';

const Versions = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const versions = useVersions();
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.version}>{`UIKit v${versions.uikit}`}</Text>
      <View style={{ width: 24 }} />
      <Text style={styles.version}>{`Chat v${versions.chat}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#777',
  },
});

export default Versions;
