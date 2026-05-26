import {TextStyle, ViewStyle} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = {
  container: {
    gap: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.lg,
  } satisfies ViewStyle,
  heroCard: {
    gap: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.lg,
    paddingVertical: GeneralStyle.spacing.lg,
    borderRadius: GeneralStyle.radius.lg,
    backgroundColor: Colors.ivory,
    borderLeftWidth: 0,
    borderTopWidth: 3,
    borderTopColor: Colors.premiumLine,
  } satisfies ViewStyle,
  heroTextBlock: {
    gap: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
  heroStats: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.md,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.navyTint,
    borderWidth: 1,
    borderColor: Colors.line,
  } satisfies ViewStyle,
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  } satisfies ViewStyle,
  heroStatDivider: {
    width: 1,
    height: 34,
    backgroundColor: Colors.borderSoft,
  } satisfies ViewStyle,
  sectionHeader: {
    marginTop: GeneralStyle.spacing.xs,
    marginBottom: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
  alignEnd: {
    alignItems: 'flex-end',
  } satisfies ViewStyle,
  alignStart: {
    alignItems: 'flex-start',
  } satisfies ViewStyle,
  textRight: {
    textAlign: 'right',
  } satisfies TextStyle,
  textLeft: {
    textAlign: 'left',
  } satisfies TextStyle,
  matchCard: {
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: GeneralStyle.spacing.sm,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
    elevation: 0,
    overflow: 'visible',
  } satisfies ViewStyle,
  primaryActions: {
    gap: GeneralStyle.spacing.sm,
  } satisfies ViewStyle,
  shortButtons: {
    gap: GeneralStyle.spacing.sm,
  } satisfies ViewStyle,
  row: {
    flexDirection: 'row',
  } satisfies ViewStyle,
  rowReverse: {
    flexDirection: 'row-reverse',
  } satisfies ViewStyle,
  name: {
    ...FontsStyle.menuTitle,
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    fontSize: 28,
  } satisfies TextStyle,
  heroSubTitle: {
    ...FontsStyle.text,
    color: Colors.slate,
  } satisfies TextStyle,
  heroStatValue: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: 22,
    textAlign: 'center',
  } satisfies TextStyle,
  heroStatLabel: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: 12,
    textAlign: 'center',
  } satisfies TextStyle,
  sectionTitle: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
    textAlign: 'right',
  } satisfies TextStyle,
  actionsCard: {
    gap: GeneralStyle.spacing.sm,
    marginBottom: GeneralStyle.spacing.lg,
  } satisfies ViewStyle,
  primaryButton: {
    borderRadius: GeneralStyle.radius.md,
    paddingVertical: GeneralStyle.spacing.md,
    backgroundColor: Colors.navyDeep,
    borderColor: Colors.premiumLine,
  } satisfies ViewStyle,
  primaryButtonText: {
    ...FontsStyle.text,
    color: Colors.white,
  } satisfies TextStyle,
  secondaryButton: {
    flex: 1,
    borderRadius: GeneralStyle.radius.md,
    paddingVertical: GeneralStyle.spacing.md,
    backgroundColor: Colors.ivory,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderBottomColor: Colors.color1Light,
  } satisfies ViewStyle,
  secondaryFullButton: {
    borderRadius: GeneralStyle.radius.md,
    paddingVertical: GeneralStyle.spacing.md,
    backgroundColor: Colors.ivory,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderBottomColor: Colors.color1Light,
  } satisfies ViewStyle,
  secondaryButtonText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  } satisfies TextStyle,
  btn: {
    margin: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
};
