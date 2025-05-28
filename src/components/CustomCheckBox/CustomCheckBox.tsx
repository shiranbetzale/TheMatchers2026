import React from 'react';
import {View} from 'react-native';
import {CustomCheckBoxType} from './CustomCheckBox.type';
import {styles} from './CustomCheckBox.style';
import CustomText from '../CustomText/CustomText';
import CustomSingleCheckBox from './CustomSingleCheckBox';

const CustomCheckBox = (props: CustomCheckBoxType) => {
  const {text, options} = props;

  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        return (
          <View key={index} style={styles.checkboxContainer}>
            <CustomSingleCheckBox {...option} />
          </View>
        );
      })}
      <CustomText text={text} />
    </View>
  );
};

export default CustomCheckBox;
