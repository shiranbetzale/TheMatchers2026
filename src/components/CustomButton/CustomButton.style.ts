import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: GeneralStyle.space,
    borderRadius: 5,
    ...Colors.Shadow,
    backgroundColor: Colors.darkGreen,
  },
  countContainer: {
    alignItems: 'center',
    padding: GeneralStyle.space,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    padding: GeneralStyle.space,
  },
});
