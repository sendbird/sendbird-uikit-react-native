import React from 'react';
import { View } from 'react-native';

const CenterView: React.FC = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }}
    >
      {children}
    </View>
  );
};

export default CenterView;
