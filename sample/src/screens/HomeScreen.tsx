import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useConnection } from '@sendbird/uikit-react-native-core';

import { USER_ID } from '../env';
import { Routes, useAppNavigation } from '../hooks/useAppNavigation';

const HomeScreen: React.FC = () => {
  const { navigation } = useAppNavigation();
  const { connect } = useConnection();

  const onNavigateToApp = async () => {
    await connect(USER_ID);
    navigation.navigate(Routes.GroupChannelTabs);
  };

  return (
    <SafeAreaView>
      <ScrollView style={{ paddingVertical: 12 }}>
        <TouchableOpacity style={styles.btn} onPress={onNavigateToApp}>
          <Text style={styles.btnTitle}>{'UIKit Sample App'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(Routes.Storybook)}>
          <Text style={styles.btnTitle}>{Routes.Storybook}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(Routes.ThemeColors)}>
          <Text style={styles.btnTitle}>{Routes.ThemeColors}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(Routes.Palette)}>
          <Text style={styles.btnTitle}>{Routes.Palette}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '90%',
    backgroundColor: '#68a8ff',
    alignSelf: 'center',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 12,
  },
  btnTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
