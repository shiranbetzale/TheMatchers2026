import {StyleSheet} from 'react-native';

const fontMap: {[key: string]: string} = {
  light: 'Birzia-Light',
  medium: 'Birzia-Medium',
  bold: 'Birzia-Bold',
};

export const styles = {
  text: (weight: keyof typeof fontMap = 'light') =>
    StyleSheet.create({
      text: {
        fontFamily: fontMap[weight],
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
      },
    }).text,
};
