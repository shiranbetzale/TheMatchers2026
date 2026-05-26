import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    gap: GeneralStyle.spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  smallContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  input: {
    marginRight: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    width: 200,
  },
  smallInput: {
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    width: 150,
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
  maxWidth: {
    maxWidth: 140,
  },
  toggleSecure: {
    position: 'absolute',
    right: GeneralStyle.spacing.lg,
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
