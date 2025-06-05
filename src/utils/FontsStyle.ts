import {StyleSheet} from 'react-native';
import Colors from './Colors';

const fontMap = {
  light: 'Birzia-Light',
  medium: 'Birzia-Medium',
  bold: 'Birzia-Bold',
};

export const FontsStyle = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: fontMap.light,
    fontSize: 18,
  },
  title: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
    fontSize: 40,
  },
  menuTitle: {
    fontFamily: fontMap.bold,
    fontSize: 26,
  },
  wizardTitle: {
    fontFamily: fontMap.medium,
    color: Colors.color1,
    fontSize: 24,
  },
  textDecoration: {
    fontFamily: fontMap.bold,
    textDecorationLine: 'underline',
  },
  subTitle: {
    fontFamily: fontMap.medium,
  },
});
