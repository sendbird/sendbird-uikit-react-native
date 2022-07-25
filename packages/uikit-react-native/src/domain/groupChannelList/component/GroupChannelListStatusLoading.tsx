import React from 'react';
import { StyleSheet, View } from 'react-native';

import TypedPlaceholder from '../../../components/TypedPlaceholder';

const GroupChannelListStatusLoading = () => {
  return (
    <View style={styles.container}>
      <TypedPlaceholder type={'loading'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default GroupChannelListStatusLoading;
