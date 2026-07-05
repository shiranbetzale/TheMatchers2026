import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontSize} from '../../utils/FontsStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayImage,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: GeneralStyle.spacing.sm * 4,
    right: GeneralStyle.spacing.sm * 2,
    zIndex: 2,
    width: GeneralStyle.size.control,
    height: GeneralStyle.size.control,
    borderRadius: 22,
    backgroundColor: Colors.ivory,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    ...SharedStyles.iconGlyphText,
    color: Colors.darkGreen,
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
    color: Colors.inkMuted,
    fontSize: FontSize.iconLarge,
    marginHorizontal: 2,
  },
  activeDot: {
    color: Colors.ivory,
    fontSize: FontSize.iconLarge,
    marginHorizontal: 2,
  },
});
