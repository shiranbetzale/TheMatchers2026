import React from 'react';
import { View } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import { styles } from './CustomHeader.style';
import { CustomHeaderType } from './CustomHeader.type';

const CustomHeader = (props: CustomHeaderType) => {
  const { headerBtns } = props;

  return (
    <View style={styles.header}>
      {
        headerBtns.map((item, index) => {
          return <CustomButton key={index} onPress={item.onPress} icon={item.comp} />
        })
      }
    </View>
  );
};

export default CustomHeader;
