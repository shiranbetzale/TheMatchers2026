import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import SharedStyles, {ProfileImageStyle} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
  },
  embeddedContainer: {
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: Colors.transparent,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: GeneralStyle.spacing.sm,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  imgContainer: {
    ...ProfileImageStyle,
    flexShrink: 0,
  },
  imgContainerRtl: {
    marginLeft: GeneralStyle.spacing.sm,
  },
  imgContainerLtr: {
    marginRight: GeneralStyle.spacing.sm,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    gap: GeneralStyle.spacing.xs,
  },
  cardHeader: {
    gap: GeneralStyle.spacing.xs,
    marginBottom: GeneralStyle.spacing.xs,
  },
  cardHeaderRtl: {
    alignItems: 'flex-end',
  },
  cardHeaderLtr: {
    alignItems: 'flex-start',
  },
  cardName: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.title,
  },
  statusPill: {
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.goldWash,
    borderWidth: 1,
    borderColor: Colors.color1Light,
  },
  statusPillRtl: {
    alignSelf: 'flex-end',
  },
  statusPillLtr: {
    alignSelf: 'flex-start',
  },
  statusPillText: {
    ...FontsStyle.text,
    color: Colors.goldDark,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  info: {
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    paddingVertical: 1,
  },
  infoRtl: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-end',
  },
  infoLtr: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  icon: {
    width: GeneralStyle.size.iconLarge,
    height: GeneralStyle.size.iconLarge,
    minWidth: GeneralStyle.size.iconLarge,
    minHeight: GeneralStyle.size.iconLarge,
    backgroundColor: Colors.ivory,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  mailIcon: {
    width: GeneralStyle.size.iconLarge,
    height: GeneralStyle.size.iconLarge,
    minWidth: GeneralStyle.size.iconLarge,
    minHeight: GeneralStyle.size.iconLarge,
    backgroundColor: Colors.ivory,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  infoButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: GeneralStyle.spacing.xs,
    marginTop: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  shareOptions: {
    width: '100%',
    marginTop: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  shareOptionsRtl: {
    alignItems: 'flex-end',
  },
  shareOptionsLtr: {
    alignItems: 'flex-start',
  },
  shareOptionRow: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
    maxWidth: '100%',
  },
  actionItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginTop: 3,
    fontSize: FontSize.micro,
    color: Colors.darkGreen,
    textAlign: 'center',
    width: '100%',
  },
});
