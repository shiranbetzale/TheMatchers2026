import {StyleSheet} from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cbContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  smallCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    marginLeft: GeneralStyle.spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: GeneralStyle.spacing.sm,
    gap: GeneralStyle.spacing.sm,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: GeneralStyle.spacing.sm,
  },
});
