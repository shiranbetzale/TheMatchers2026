import React from 'react';
import {Text} from 'react-native';
import {styles} from './CustomText.style';
import {CustomTextType} from './CustomText.type';
import { useLanguage } from '../../utils/LanguageProvider';

const CustomText = (props: CustomTextType) => {
  const {text, fontType = 'text', customStyle} = props;
  const {isRTL, t} = useLanguage();

  return <Text style={[styles.text(fontType), isRTL ? styles.rtl : styles.ltr, customStyle]}>{t(String(text))}</Text>;
};

export default CustomText;
