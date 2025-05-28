import React from 'react';
import {Text} from 'react-native';
import {styles} from './CustomText.style';
// import {useTranslation} from 'react-i18next';

const CustomText = (props: CustomTextType) => {
  const {text = '', fontWeight = 'light', customTxtStyle} = props;

  return <Text style={[styles.text(fontWeight), customTxtStyle]}>{text}</Text>;
};

export default CustomText;
