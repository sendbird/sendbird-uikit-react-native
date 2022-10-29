import React from 'react';
import { StyleSheet, View } from 'react-native';

import TypedPlaceholder from '../../../components/TypedPlaceholder';

const GroupChannelMutedMembersStatusEmpty = () => {
  return (
    <View style={styles.container}>
      <TypedPlaceholder type={'no-muted-members'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default GroupChannelMutedMembersStatusEmpty;
