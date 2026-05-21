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
    marginRight: GeneralStyle.space,
    paddingHorizontal: GeneralStyle.space * 1.3,
    paddingVertical: GeneralStyle.space,
    width: 200,
  },
  smallInput: {
    padding: GeneralStyle.space / 2,
    width: 150,
    marginTop: GeneralStyle.space / 2,
  },
  baseInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.white,
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
    marginTop: GeneralStyle.space,
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
    right: GeneralStyle.space * 2,
    justifyContent: 'center',
    zIndex: 1,
  },
  toggleSecureRtl: {
    left: GeneralStyle.space,
    right: undefined,
  },
  toggleSecureText: {
    ...FontsStyle.text,
    fontSize: 14,
    color: Colors.darkGreen,
  },
});
