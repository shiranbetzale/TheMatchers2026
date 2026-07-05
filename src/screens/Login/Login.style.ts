import {StyleSheet} from 'react-native';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    flex: 1,
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
    backgroundColor: Colors.white,
    ...Colors.Shadow,
  },
  langRow: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
  },
  langSwitchText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.small,
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
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: GeneralStyle.spacing.lg,
    borderTopLeftRadius: GeneralStyle.radius.lg,
    borderTopRightRadius: GeneralStyle.radius.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.color1,
  },
  modalTitle: {
    ...FontsStyle.title,
    textAlign: 'center',
  },
  languageOptions: {
    width: '100%',
    gap: GeneralStyle.spacing.sm,
  },
  modalOption: {
    width: '100%',
    minHeight: GeneralStyle.size.largeControl,
    paddingHorizontal: GeneralStyle.spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
  },
  modalOptionSelected: {
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.navyDeep,
  },
  modalOptionText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
  },
  modalOptionTextSelected: {
    color: Colors.white,
  },
  languageCode: {
    ...FontsStyle.text,
    color: Colors.slate,
  },
  codeModalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.lg,
    backgroundColor: Colors.overlay,
  },
  codeModalContent: {
    width: '100%',
    maxWidth: 420,
    padding: GeneralStyle.spacing.lg,
    borderRadius: GeneralStyle.radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderTopWidth: 2,
    borderTopColor: Colors.premiumLine,
    backgroundColor: Colors.white,
    ...Colors.Shadow,
  },
  codeModalHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.sm,
  },
  codeModalTitle: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.title,
  },
  codeModalSubtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
    lineHeight: 22,
  },
  codeModalCloseButton: {
    width: GeneralStyle.size.icon,
    height: GeneralStyle.size.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  codeModalCloseText: {
    ...SharedStyles.iconGlyphText,
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
  },
  codeModalActions: {
    gap: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
  },
  resendButton: {
    width: '100%',
    minHeight: GeneralStyle.size.control,
    borderWidth: 0,
    backgroundColor: Colors.transparent,
  },
  resendButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.info,
  },
  verificationAlternatives: {
    width: '100%',
    gap: GeneralStyle.spacing.xs,
  },
  modalVoiceButton: {
    width: '100%',
    minHeight: GeneralStyle.size.control,
    borderColor: Colors.color1Light,
    backgroundColor: Colors.goldWash,
  },
  modalVoiceButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
  },
  codeCancelButton: {
    flex: 1,
    minHeight: GeneralStyle.size.field,
    borderRadius: GeneralStyle.radius.md,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  codeCancelButtonText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  codeConfirmButton: {
    flex: 1,
    minHeight: GeneralStyle.size.field,
    borderRadius: GeneralStyle.radius.md,
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.navyDeep,
  },
  codeConfirmButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
  },
  title: {
    ...FontsStyle.title,
    marginBottom: GeneralStyle.spacing.xs,
    color: Colors.darkGreen,
    zIndex: 2,
    lineHeight: 30,
  },
  heroContent: {
    alignItems: 'center',
    paddingBottom: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.md,
  },
  brandMark: {
    alignSelf: 'center',
    width: GeneralStyle.size.largeControl,
    height: GeneralStyle.size.largeControl,
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
    fontSize: FontSize.large,
    color: Colors.goldDark,
    letterSpacing: 0,
  },
  eyebrow: {
    ...FontsStyle.textDecoration,
    color: Colors.goldDark,
    textAlign: 'center',
    fontSize: FontSize.small,
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
    maxWidth: GeneralStyle.size.content,
    marginTop: GeneralStyle.spacing.md,
    padding: GeneralStyle.spacing.lg,
  },
  formContent: {
    width: '100%',
  },
  space: {
    marginVertical: GeneralStyle.spacing.sm,
  },
  loginButton: {
    minHeight: GeneralStyle.size.largeControl,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.navyDeep,
    borderColor: Colors.premiumLine,
    borderBottomWidth: 2,
  },
  loginButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    fontSize: FontSize.large,
  },
  voiceButton: {
    width: '100%',
    minHeight: GeneralStyle.size.field,
    marginTop: GeneralStyle.spacing.xs,
    borderColor: Colors.color1Light,
    backgroundColor: Colors.goldWash,
  },
  voiceButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
  },
});
