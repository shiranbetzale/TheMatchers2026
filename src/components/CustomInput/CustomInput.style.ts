import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  fieldContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  smallContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
  },
  smallInput: {
    width: '100%',
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    marginTop: GeneralStyle.spacing.xs,
  },
  baseInput: {
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.borderSoft,
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  errorInput: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  readOnlyInput: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.surfaceMuted,
    color: Colors.slate,
  },
  ltrInput: {
    writingDirection: 'ltr',
  },
  rtlInput: {
    writingDirection: 'rtl',
  },
  textArea: {
    flex: 0,
    height: 140,
    width: '100%',
    marginTop: GeneralStyle.spacing.sm,
    marginRight: 0,
    textAlignVertical: 'top',
  },
  textAreaContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  textAreaContainerLtr: {
    alignItems: 'flex-start',
  },
  textAreaContainerRtl: {
    alignItems: 'flex-end',
  },
  labelWrapper: {
    flex: 0.42,
    minWidth: GeneralStyle.size.avatar,
    flexShrink: 0,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
  },
  errorText: {
    ...FontsStyle.text,
    width: '100%',
    color: Colors.danger,
    fontSize: FontSize.caption,
    lineHeight: 18,
    marginTop: GeneralStyle.spacing.xs,
  },
  toggleSecure: {
    position: 'absolute',
    right: GeneralStyle.spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  toggleSecureRtl: {
    left: GeneralStyle.spacing.sm,
    right: undefined,
  },
  toggleSecureText: {
    ...FontsStyle.text,
    fontSize: FontSize.small,
    color: Colors.darkGreen,
  },
});
