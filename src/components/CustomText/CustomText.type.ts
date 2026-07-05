import {FontsStyle} from '../../utils/FontsStyle';
import {StyleProp, TextProps, TextStyle} from 'react-native';

export type FontType = keyof typeof FontsStyle;

export type CustomTextType = Omit<TextProps, 'children' | 'style'> & {
  text: string | number;
  fontType?: FontType;
  customStyle?: StyleProp<TextStyle>;
};
