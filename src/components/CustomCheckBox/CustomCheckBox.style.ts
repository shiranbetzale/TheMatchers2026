import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cbContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  smallCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    flexShrink: 0,
  },
  baseContainer: {
    flexDirection: 'column',
  },
  alignLtr: {
    alignItems: 'flex-start',
  },
  alignRtl: {
    alignItems: 'flex-end',
  },
  checkboxContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: GeneralStyle.spacing.sm,
    gap: GeneralStyle.spacing.sm,
  },
  checkboxContainerLtr: {
    flexDirection: 'row',
  },
  checkboxContainerRtl: {
    flexDirection: 'row-reverse',
  },
  checkbox: {
    width: 28,
    height: 28,
    alignSelf: 'center',
    flexShrink: 0,
  },
  checkboxBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.darkGreen,
    backgroundColor: Colors.surfaceElevated,
  },
  checkboxBoxSelected: {
    borderColor: Colors.color1,
    backgroundColor: Colors.color1,
  },
  disabledCheckbox: {
    opacity: 0.45,
  },
  checkMarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  label: {
    margin: GeneralStyle.spacing.sm,
  },
  optionText: {
    ...FontsStyle.text,
    flex: 1,
    minWidth: 0,
    color: Colors.black,
  },
  textRight: {
    textAlign: 'right',
    writingDirection: 'rtl',
    width: '100%',
  },
  textLeft: {
    textAlign: 'left',
    writingDirection: 'ltr',
    width: '100%',
  },
});
