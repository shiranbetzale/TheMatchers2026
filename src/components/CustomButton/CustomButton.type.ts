import {ReactNode} from 'react';
import {TextStyle, TouchableOpacityProps, ViewStyle} from 'react-native';

export type CustomButtonType = Omit<TouchableOpacityProps, 'style'> & {
  accessibilityLabel?: string;
  text?: string;
  customStyle?: ViewStyle | ViewStyle[] | any;
  style?: TouchableOpacityProps['style'];
  customTextStyle?: TextStyle | TextStyle[] | any;
  isDisabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  unstyled?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'icon'
    | 'iconDanger';
  children?: ReactNode;
  icon?: ReactNode;
};
