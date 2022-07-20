// @ts-nocheck - !!REMOVE
import React from 'react';
import { StyleSheet, View } from 'react-native';

import TypedPlaceholder from '../../../components/TypedPlaceholder';

const __domain__StatusEmpty = () => {
  return (
    <View style={styles.container}>
      <TypedPlaceholder type={'no-messages'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default __domain__StatusEmpty;
