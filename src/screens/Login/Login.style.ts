import { StyleSheet } from 'react-native';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  langSwitchContainer: {
    alignItems: 'flex-end',
    paddingTop: GeneralStyle.spacing.xs,
    paddingBottom: GeneralStyle.spacing.sm,
    zIndex: 2,
  },
  langSwitchButton: {
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderRadius: GeneralStyle.radius.md,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.surfaceElevated,
    ...Colors.Shadow,
  },
  langRow: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
  },
  langSwitchText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 14,
  },
  errorContainer: {
    marginHorizontal: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
  },
  errorContainerBottom: {
    marginHorizontal: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceElevated,
    padding: GeneralStyle.spacing.lg,
    borderTopLeftRadius: GeneralStyle.radius.sm,
    borderTopRightRadius: GeneralStyle.radius.sm,
    borderTopWidth: 2,
    borderTopColor: Colors.color1,
  },
  modalTitle: {
    ...FontsStyle.title,
    marginBottom: GeneralStyle.spacing.sm,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: GeneralStyle.spacing.sm,
  },
  modalOptionText: {
    ...FontsStyle.text,
    textAlign: 'center',
  },
  title: {
    ...FontsStyle.title,
    marginBottom: GeneralStyle.spacing.xs,
    color: Colors.darkGreen,
    zIndex: 2,
    fontSize: 38,
    lineHeight: 44,
  },
  heroContent: {
    alignItems: 'center',
    paddingBottom: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.md,
  },
  brandMark: {
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: GeneralStyle.spacing.sm,
    backgroundColor: Colors.goldWash,
    borderWidth: 1,
    borderColor: Colors.color1Light,
  },
  brandMarkText: {
    ...FontsStyle.textDecoration,
    fontSize: 18,
    color: Colors.goldDark,
    letterSpacing: 0,
  },
  eyebrow: {
    ...FontsStyle.textDecoration,
    color: Colors.goldDark,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: GeneralStyle.spacing.xs,
  },
  subtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: GeneralStyle.spacing.lg,
  },
  whiteCardContainer: {
    alignSelf: 'center',
    maxWidth: 560,
    marginTop: GeneralStyle.spacing.md,
    padding: GeneralStyle.spacing.lg,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderSoft,
    borderTopColor: Colors.premiumLine,
    borderBottomWidth: 2,
    borderBottomColor: Colors.color1Light,
  },
  formContent: {
    width: '100%',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  space: {
    marginVertical: GeneralStyle.spacing.sm,
  },
  loginButton: {
    minHeight: 56,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.navyDeep,
    borderColor: Colors.premiumLine,
    borderBottomWidth: 2,
  },
  loginButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    fontSize: 18,
  },
});
