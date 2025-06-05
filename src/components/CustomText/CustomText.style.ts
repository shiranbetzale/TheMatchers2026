import {StyleSheet} from 'react-native';
import {FontsStyle} from '../../utils/FontsStyle';
import {FontType} from './CustomText.type';

export const styles = {
  text: (fontType: FontType) => {
    return FontsStyle[fontType];
  },
};
