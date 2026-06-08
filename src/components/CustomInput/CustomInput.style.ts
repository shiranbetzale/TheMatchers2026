import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  fieldContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
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
    backgroundColor: Colors.surfaceElevated,
    borderBottomColor: Colors.borderSoft,
    ...FontsStyle.text,
    color: Colors.black,
  },
  errorInput: {
    borderColor: '#D65A50',
    backgroundColor: '#FFF5F1',
  },
  readOnlyInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
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
    minWidth: 92,
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
    color: '#9F4239',
    fontSize: 12,
    lineHeight: 18,
    marginTop: GeneralStyle.spacing.xs,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
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
    fontSize: 14,
    color: Colors.darkGreen,
  },
});
