import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import {
  CardBorderStyle,
  ProfileImageStyle,
} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    opacity: 1,
  },
  imgContainer: {
    ...ProfileImageStyle,
    alignItems: 'center',
    marginTop: GeneralStyle.spacing.sm,
  },
  infoContainer: {
    ...CardBorderStyle,
    width: '100%',
    alignItems: 'center',
    marginTop: GeneralStyle.spacing.xs,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.md,
    justifyContent: 'space-between',
    backgroundColor: Colors.champagne,
    shadowOpacity: 0,
    elevation: 0,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  info: {
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 0,
  },
  detailsBlock: {
    flex: 1,
    minWidth: 0,
  },
  detailsBlockRtl: {
    alignItems: 'flex-end',
  },
  detailsBlockLtr: {
    alignItems: 'flex-start',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  boy: {
    backgroundColor: Colors.softBlue,
  },
  girl: {
    backgroundColor: Colors.roseSoft,
  },
  txt: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
  },
  actions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    flexShrink: 0,
    paddingHorizontal: GeneralStyle.spacing.xs,
  },
  actionButton: {
    width: GeneralStyle.size.iconLarge,
    height: GeneralStyle.size.iconLarge,
    minHeight: GeneralStyle.size.iconLarge,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    shadowOpacity: 0,
    elevation: 0,
  },
});
