import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: GeneralStyle.spacing.sm * 4,
    right: GeneralStyle.spacing.sm * 2,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.darkGreen,
    fontSize: 32,
    lineHeight: 36,
  },
  slider: {
    width: '100%',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
  },
  image: {
    width: '100%',
    height: '82%',
  },
  pagination: {
    position: 'absolute',
    bottom: GeneralStyle.spacing.sm * 4,
    flexDirection: 'row',
  },
  dot: {
    color: '#777',
    fontSize: 34,
    marginHorizontal: 2,
  },
  activeDot: {
    color: Colors.surface,
    fontSize: 34,
    marginHorizontal: 2,
  },
});
