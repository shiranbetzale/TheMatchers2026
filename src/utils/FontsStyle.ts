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
    fontSize: 16,
  },
  title: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
    fontSize: 40,
    textAlign: 'center',
  },
  menuTitle: {
    fontFamily: fontMap.bold,
    fontSize: 23,
    color: Colors.surface,
  },
  wizardTitle: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
    fontSize: 24,
  },
  textDecoration: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
  },
  subTitle: {
    fontFamily: fontMap.medium,
  },
  questionLabel: {
    fontFamily: fontMap.medium,
    color: Colors.darkGreen,
    fontSize: 16,
  },
});
