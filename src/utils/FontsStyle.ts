import {StyleSheet} from 'react-native';
import Colors from './Colors';

const fontMap = {
  light: 'Birzia-Light',
  medium: 'Birzia-Medium',
  bold: 'Birzia-Bold',
};

export const FontSize = {
  micro: 16,
  caption: 16,
  small: 16,
  body: 16,
  large: 18,
  title: 24,
  heading: 24,
  section: 24,
  display: 28,
  displayLarge: 30,
  iconLarge: 34,
  hero: 40,
} as const;

export const FontsStyle = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: fontMap.light,
    fontSize: FontSize.body,
  },
  title: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
    textAlign: 'center',
  },
  menuTitle: {
    fontFamily: fontMap.bold,
    fontSize: FontSize.heading,
    color: Colors.ivory,
  },
  wizardTitle: {
    fontFamily: fontMap.bold,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
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
    fontSize: FontSize.body,
  },
});
