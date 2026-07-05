import React from 'react';
import {Text} from 'react-native';
import {CustomTextType} from './CustomText.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {FontsStyle} from '../../utils/FontsStyle';
import SharedStyles from '../../utils/SharedStyles';

const CustomText = (props: CustomTextType) => {
  const {text, fontType = 'text', customStyle, ...textProps} = props;
  const {isRTL, t} = useLanguage();

  return (
    <Text
      {...textProps}
      style={[
        FontsStyle[fontType],
        isRTL ? SharedStyles.textRight : SharedStyles.textLeft,
        customStyle,
      ]}>
      {t(String(text))}
    </Text>
  );
};

export default CustomText;
