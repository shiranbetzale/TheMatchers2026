import React from 'react';
import { Text } from 'react-native';
import { styles } from './CustomText.style';
import { CustomTextType } from './CustomText.type';

const CustomText = (props: CustomTextType) => {
  const { text, customStyle } = props;

  return (
    <Text style={[styles.text, { ...customStyle }]}>{text}</Text>
  );
};

export default CustomText;
