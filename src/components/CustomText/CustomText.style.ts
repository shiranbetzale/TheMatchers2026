import {FontsStyle} from '../../utils/FontsStyle';
import {FontType} from './CustomText.type';

export const styles = {
  text: (fontType: FontType) => {
    return FontsStyle[fontType];
  },
  ltr: {
    textAlign: 'left' as const,
    writingDirection: 'ltr' as const,
  },
  rtl: {
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
};
