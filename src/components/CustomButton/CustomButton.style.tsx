import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.lightBrown,
    paddingVertical: GeneralStyle.space,
    paddingHorizontal: GeneralStyle.space,
    borderRadius: 5
  },
  countContainer: {
    alignItems: 'center',
    padding: GeneralStyle.space,
  },
  disabled: {
    opacity: 0.3
  }
});
