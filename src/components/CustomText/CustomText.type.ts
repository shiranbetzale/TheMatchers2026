import {FontsStyle} from '../../utils/FontsStyle';
import { StyleProp, TextStyle } from 'react-native';

export type FontType = keyof typeof FontsStyle;

export type CustomTextType = {
  text: string | number;
  fontType?: FontType;
  customStyle?: StyleProp<TextStyle>;
};
