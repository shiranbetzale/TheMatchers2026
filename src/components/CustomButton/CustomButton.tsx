import React from 'react';
import {TouchableOpacity} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomButton.style';
import {CustomButtonType} from './CustomButton.type';

const CustomButton = (props: CustomButtonType) => {
  const {onPress = () => {}, text, customStyle, isDisabled, children} = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {...customStyle},
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      {text && <CustomText text={text} />}
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
