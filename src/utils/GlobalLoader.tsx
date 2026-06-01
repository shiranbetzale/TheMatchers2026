import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import {useLoading} from './LoadingProvider'

const GlobalLoader = () => {
  const {isLoading} = useLoading();

  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.25)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
};

export default GlobalLoader;
