import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
  },
  cbContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  smallCheckbox: {
    width: GeneralStyle.size.iconXs,
    height: GeneralStyle.size.iconXs,
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
    width: GeneralStyle.size.iconSm,
    height: GeneralStyle.size.iconSm,
    alignSelf: 'center',
    flexShrink: 0,
  },
  checkboxBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.darkGreen,
    backgroundColor: Colors.white,
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
    fontSize: FontSize.large,
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
    ...SharedStyles.textRight,
    width: '100%',
  },
  textLeft: {
    ...SharedStyles.textLeft,
    width: '100%',
  },
});
