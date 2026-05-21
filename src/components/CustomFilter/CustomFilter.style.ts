import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    padding: GeneralStyle.space,
    height: Dimensions.get('screen').height - 120,
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: GeneralStyle.space,
    marginBottom: GeneralStyle.space,
  },
  actionButton: {
    flex: 1,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.slate,
  },
  filterFieldContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
  },
  filterField: {
    width: '50%',
    padding: GeneralStyle.space,
    flexDirection: 'row-reverse',
  },
});
