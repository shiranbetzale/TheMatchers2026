import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopColor: Colors.color1,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  imgBtnContainer: {
    alignItems: 'center',
  },
  imgBtnContainerRtl: {
    marginLeft: GeneralStyle.space * 2,
  },
  imgBtnContainerLtr: {
    marginRight: GeneralStyle.space * 2,
  },
  imgContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.color1Light,
    backgroundColor: Colors.surface,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
  },
  mailIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 0,
  },
  mailIconText: {
    color: Colors.darkGreen,
    fontWeight: '700',
  },
  infoButtons: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: GeneralStyle.space / 2,
    marginTop: GeneralStyle.space,
    maxWidth: 96,
  },
});
