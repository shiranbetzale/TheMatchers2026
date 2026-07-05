import {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import Colors from './Colors';
import {FontSize, FontsStyle} from './FontsStyle';
import GeneralStyle from './GeneralStyle';

export const CardBorderStyle = {
  borderWidth: 1,
  borderColor: Colors.borderSoft,
  borderRadius: GeneralStyle.radius.md,
} satisfies ViewStyle;

export const ProfileImageStyle = {
  width: GeneralStyle.size.profileImage,
  height: GeneralStyle.size.profileImage,
  borderRadius: GeneralStyle.size.profileImage / 2,
  borderWidth: 1,
  borderColor: Colors.borderSoft,
  backgroundColor: Colors.white,
  overflow: 'hidden',
} satisfies ImageStyle;

export const CardSurfaceStyle = {
  width: '100%',
  padding: GeneralStyle.spacing.md,
  ...CardBorderStyle,
  backgroundColor: Colors.ivory,
} satisfies ViewStyle;

const SharedStyles = {
  flex: {
    flex: 1,
  } satisfies ViewStyle,
  row: {
    flexDirection: 'row',
  } satisfies ViewStyle,
  rowReverse: {
    flexDirection: 'row-reverse',
  } satisfies ViewStyle,
  alignStart: {
    alignItems: 'flex-start',
  } satisfies ViewStyle,
  alignEnd: {
    alignItems: 'flex-end',
  } satisfies ViewStyle,
  textLeft: {
    textAlign: 'left',
    writingDirection: 'ltr',
  } satisfies TextStyle,
  textRight: {
    textAlign: 'right',
    writingDirection: 'rtl',
  } satisfies TextStyle,
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: GeneralStyle.spacing.lg,
    backgroundColor: Colors.overlay,
  } satisfies ViewStyle,
  modalHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  } satisfies ViewStyle,
  modalCloseButton: {
    width: GeneralStyle.size.icon,
    height: GeneralStyle.size.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
  } satisfies ViewStyle,
  modalCloseText: {
    ...FontsStyle.text,
    width: 20,
    height: 20,
    color: Colors.darkGreen,
    fontSize: FontSize.title,
    lineHeight: 20,
    textAlign: 'center',
  } satisfies TextStyle,
  actionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
  } satisfies ViewStyle,
  actionButton: {
    flex: 1,
    minHeight: GeneralStyle.size.field,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
  } satisfies ViewStyle,
  primaryAction: {
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.navyDeep,
  } satisfies ViewStyle,
  secondaryAction: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
  } satisfies ViewStyle,
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.lg,
    borderWidth: 1,
    borderRadius: GeneralStyle.radius.md,
  } satisfies ViewStyle,
  buttonSmall: {
    minHeight: GeneralStyle.size.control,
    paddingVertical: GeneralStyle.spacing.xs,
  } satisfies ViewStyle,
  buttonMedium: {
    minHeight: GeneralStyle.size.action,
    paddingVertical: GeneralStyle.spacing.sm,
  } satisfies ViewStyle,
  buttonLarge: {
    minHeight: GeneralStyle.size.largeControl,
    paddingVertical: GeneralStyle.spacing.md,
  } satisfies ViewStyle,
  buttonPrimary: {
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.navyDeep,
    ...Colors.Shadow,
  } satisfies ViewStyle,
  buttonSecondary: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
  } satisfies ViewStyle,
  buttonDanger: {
    borderColor: Colors.danger,
    backgroundColor: Colors.danger,
  } satisfies ViewStyle,
  buttonGhost: {
    borderColor: Colors.transparent,
    backgroundColor: Colors.transparent,
  } satisfies ViewStyle,
  buttonPrimaryText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    textAlign: 'center',
  } satisfies TextStyle,
  buttonSecondaryText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    textAlign: 'center',
  } satisfies TextStyle,
  buttonDangerText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    textAlign: 'center',
  } satisfies TextStyle,
  buttonGhostText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    textAlign: 'center',
  } satisfies TextStyle,
  iconButton: {
    width: GeneralStyle.size.field,
    height: GeneralStyle.size.field,
    alignItems: 'center',
    justifyContent: 'center',
    padding: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.color1Light,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  } satisfies ViewStyle,
  iconButtonDanger: {
    width: GeneralStyle.size.field,
    height: GeneralStyle.size.field,
    alignItems: 'center',
    justifyContent: 'center',
    padding: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.dangerSoft,
  } satisfies ViewStyle,
  iconGlyphText: {
    width: 20,
    height: 20,
    fontSize: FontSize.title,
    lineHeight: 20,
    textAlign: 'center',
  } satisfies TextStyle,
  disabled: {
    opacity: 0.5,
  } satisfies ViewStyle,
  card: {
    ...CardSurfaceStyle,
  } satisfies ViewStyle,
};

export default SharedStyles;
