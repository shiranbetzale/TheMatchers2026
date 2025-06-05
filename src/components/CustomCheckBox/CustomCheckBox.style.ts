import {StyleSheet} from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cbContainer: {
    flexDirection: 'column',
  },
  smallCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    marginLeft: GeneralStyle.space,
  },
  baseContainer: {
    flexDirection: 'column',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: GeneralStyle.space,
  },
  checkbox: {
    alignSelf: 'center',
    marginLeft: GeneralStyle.space,
  },
  label: {
    margin: GeneralStyle.space,
  },
});
