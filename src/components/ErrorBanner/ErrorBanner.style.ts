import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: GeneralStyle.space / 1.2,
    paddingHorizontal: GeneralStyle.space,
    borderRadius: 10,
    ...Colors.Shadow,
  },
  error: {
    backgroundColor: '#FFECE8',
    borderColor: '#D64545',
    borderWidth: 1,
  },
  warning: {
    backgroundColor: '#FFF7E0',
    borderColor: '#D19B2C',
    borderWidth: 1,
  },
  info: {
    backgroundColor: '#E8F0FF',
    borderColor: Colors.darkGreen,
    borderWidth: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: GeneralStyle.space / 2,
  },
  text: {
    ...FontsStyle.text,
    flex: 1,
    color: Colors.black,
  },
});
