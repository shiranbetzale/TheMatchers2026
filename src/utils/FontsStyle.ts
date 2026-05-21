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
    fontSize: 15,
  },
  title: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
    fontSize: 42,
    textAlign: 'center',
  },
  menuTitle: {
    fontFamily: fontMap.bold,
    fontSize: 24,
    color: Colors.surface,
  },
  wizardTitle: {
    fontFamily: fontMap.medium,
    color: Colors.color1,
    fontSize: 24,
  },
  textDecoration: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
  },
  subTitle: {
    fontFamily: fontMap.medium,
  },
});
