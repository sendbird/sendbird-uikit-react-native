import React from 'react';
import { StyleSheet, View } from 'react-native';

import TypedPlaceholder from '../../../components/TypedPlaceholder';
import type { UserListModule } from '../types';

const UserListStatusError: UserListModule<unknown>['StatusError'] = ({ onPressRetry }) => {
  return (
    <View style={styles.container}>
      <TypedPlaceholder type={'error-wrong'} onPressRetry={onPressRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default UserListStatusError;
