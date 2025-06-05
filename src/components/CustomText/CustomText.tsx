import React from 'react';
import {Text} from 'react-native';
import {styles} from './CustomText.style';
import {CustomTextType} from './CustomText.type';
import { useTranslation } from 'react-i18next';

const CustomText = (props: CustomTextType) => {
  const {text, fontType = 'text', customStyle} = props;
  const {t} = useTranslation();

  return <Text style={[styles.text(fontType), customStyle]}>{t(text)}</Text>;
};

export default CustomText;
