import React from 'react';
import { TouchableOpacity } from 'react-native';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomButton.style';
import { CustomButtonType } from './CustomButton.type';

const CustomButton = (props: CustomButtonType) => {
  const { icon, onPress = () => { }, text, customTextStyle, customStyle, isDisabled, children } = props;

  return (
    <TouchableOpacity
      style={[icon ? styles.icon : styles.container, customStyle, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {text &&
        <CustomText
          text={text}
          customStyle={customTextStyle}
        />
      }
      {children}
      {icon}
    </TouchableOpacity>
  );
};

export default CustomButton;
