import {FontsStyle} from '../../utils/FontsStyle';

export type FontType = keyof typeof FontsStyle;

export type CustomTextType = {
  text: any;
  fontType?: FontType;
  customStyle?: any;
};
