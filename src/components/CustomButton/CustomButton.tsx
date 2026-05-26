import React, {useRef} from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomButton.style';
import { CustomButtonType } from './CustomButton.type';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CustomButton = (props: CustomButtonType) => {
  const { icon, onPress = () => { }, text, customTextStyle, customStyle, isDisabled, children } = props;
  const pressScale = useRef(new Animated.Value(1)).current;

  const defaultTextColor = !icon ? { color: '#fff' } : undefined;
  const animatePress = (toValue: number) => {
    Animated.spring(pressScale, {
      toValue,
      useNativeDriver: true,
      speed: 28,
      bounciness: 4,
    }).start();
  };

  return (
    <AnimatedTouchable
      style={[
        icon ? styles.icon : styles.container,
        customStyle,
        isDisabled && styles.disabled,
        {transform: [{scale: pressScale}]},
      ]}
      onPress={onPress}
      onPressIn={() => animatePress(0.97)}
      onPressOut={() => animatePress(1)}
      activeOpacity={0.86}
      disabled={isDisabled}
    >
      {text &&
        <CustomText
          text={text}
          customStyle={[defaultTextColor, customTextStyle]}
        />
      }
      {children}
      {icon}
    </AnimatedTouchable>
  );
};

export default CustomButton;
