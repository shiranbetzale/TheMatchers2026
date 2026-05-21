import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    padding: GeneralStyle.space,
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: GeneralStyle.space,
    marginBottom: GeneralStyle.space,
  },
  btn: {
    flex: 1,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.slate,
  },
});
