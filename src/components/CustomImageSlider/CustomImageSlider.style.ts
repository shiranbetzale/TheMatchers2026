import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize} from '../../utils/FontsStyle';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  slider: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row-reverse',
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
  },
  dot: {
    color: Colors.inkMuted,
    fontSize: FontSize.hero,
  },
  activeDot: {
    color: Colors.white,
    fontSize: FontSize.hero,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  slideImage: {
    resizeMode: 'cover',
  },
});
