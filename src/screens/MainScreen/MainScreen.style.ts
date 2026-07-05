import {TextStyle, ViewStyle} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = {
  ...SharedStyles,
  container: {
    gap: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.lg,
  } satisfies ViewStyle,
  heroCard: {
    gap: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.lg,
    paddingVertical: GeneralStyle.spacing.lg,
    backgroundColor: Colors.ivory,
  } satisfies ViewStyle,
  heroTextBlock: {
    gap: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
  pilotBadge: {
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: 4,
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.goldWash,
  } satisfies ViewStyle,
  pilotText: {
    ...FontsStyle.textDecoration,
    color: Colors.goldDark,
    fontSize: FontSize.caption,
    textAlign: 'center',
  } satisfies TextStyle,
  heroStats: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
  heroStat: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.champagne,
  } satisfies ViewStyle,
  sectionHeader: {
    marginTop: GeneralStyle.spacing.xs,
    marginBottom: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
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
  name: {
    ...FontsStyle.menuTitle,
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    fontSize: FontSize.display,
  } satisfies TextStyle,
  heroSubTitle: {
    ...FontsStyle.text,
    color: Colors.slate,
  } satisfies TextStyle,
  heroStatValue: {
    ...FontsStyle.menuTitle,
    color: Colors.color1,
    fontSize: FontSize.heading,
    lineHeight: 28,
    height: 28,
    textAlign: 'center',
  } satisfies TextStyle,
  heroStatLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
    lineHeight: 20,
    minHeight: 40,
    textAlign: 'center',
    textAlignVertical: 'top',
  } satisfies TextStyle,
  sectionTitle: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
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
