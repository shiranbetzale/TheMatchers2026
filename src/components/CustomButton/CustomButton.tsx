import React, {useRef} from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {CustomButtonType} from './CustomButton.type';
import SharedStyles from '../../utils/SharedStyles';
import {useLanguage} from '../../utils/LanguageProvider';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
export const BUTTON_ICON_SIZE = 20;
const DEFAULT_HIT_SLOP = {top: 12, right: 12, bottom: 12, left: 12};

const CustomButton = (props: CustomButtonType) => {
  const {
    accessibilityLabel,
    accessibilityState,
    children,
    customStyle,
    customTextStyle,
    disabled,
    icon,
    hitSlop = DEFAULT_HIT_SLOP,
    isDisabled,
    onPress = () => {},
    size = 'medium',
    style,
    text,
    testID,
    unstyled = false,
    variant,
    ...touchableProps
  } = props;
  const {t} = useLanguage();
  const pressScale = useRef(new Animated.Value(1)).current;

  const resolvedVariant = variant ?? (icon ? 'icon' : 'primary');
  const resolvedTestID =
    testID || (text ? `button-${String(text).replace(/\s+/g, '-')}` : undefined);
  const variantStyle = {
    primary: SharedStyles.buttonPrimary,
    secondary: SharedStyles.buttonSecondary,
    danger: SharedStyles.buttonDanger,
    ghost: SharedStyles.buttonGhost,
    icon: SharedStyles.iconButton,
    iconDanger: SharedStyles.iconButtonDanger,
  }[resolvedVariant];
  const textStyle = {
    primary: SharedStyles.buttonPrimaryText,
    secondary: SharedStyles.buttonSecondaryText,
    danger: SharedStyles.buttonDangerText,
    ghost: SharedStyles.buttonGhostText,
    icon: undefined,
    iconDanger: undefined,
  }[resolvedVariant];
  const sizeStyle = {
    small: SharedStyles.buttonSmall,
    medium: SharedStyles.buttonMedium,
    large: SharedStyles.buttonLarge,
  }[size];
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
      testID={resolvedTestID}
      style={[
        !unstyled &&
          resolvedVariant !== 'icon' &&
          resolvedVariant !== 'iconDanger' &&
          SharedStyles.buttonBase,
        !unstyled &&
          resolvedVariant !== 'icon' &&
          resolvedVariant !== 'iconDanger' &&
          sizeStyle,
        style,
        customStyle,
        !unstyled && variantStyle,
        (isDisabled || disabled) && SharedStyles.disabled,
        {transform: [{scale: pressScale}]},
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (text ? t(text) : undefined)}
      accessibilityState={{
        ...accessibilityState,
        disabled: Boolean(isDisabled || disabled),
      }}
      onPressIn={() => animatePress(0.97)}
      onPressOut={() => animatePress(1)}
      activeOpacity={0.86}
      hitSlop={hitSlop}
      disabled={isDisabled || disabled}
      {...touchableProps}>
      {text && (
        <CustomText
          text={text}
          customStyle={[customTextStyle, !unstyled && textStyle]}
        />
      )}
      {children}
      {icon}
    </AnimatedTouchable>
  );
};

export default CustomButton;
