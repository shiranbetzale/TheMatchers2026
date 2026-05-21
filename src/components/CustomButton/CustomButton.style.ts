import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: GeneralStyle.space * 1.25,
    paddingHorizontal: GeneralStyle.space * 1.8,
    borderRadius: 16,
    ...Colors.Shadow,
    backgroundColor: Colors.color1,
    borderWidth: 1,
    borderColor: '#D8BE84',
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
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: GeneralStyle.space,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
