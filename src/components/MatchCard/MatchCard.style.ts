import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontsStyle} from '../../utils/FontsStyle';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'stretch',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
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
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.goldWash,
    backgroundColor: Colors.surfaceElevated,
    flexShrink: 0,
    ...Colors.Shadow,
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
    fontSize: 21,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
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
    fontSize: 12,
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
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
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
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
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
  actionItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginTop: 3,
    fontSize: 10,
    color: Colors.darkGreen,
    textAlign: 'center',
    width: '100%',
  },
});
