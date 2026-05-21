import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: GeneralStyle.space * 1.7,
    paddingVertical: GeneralStyle.space * 1.5,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 3,
    borderTopColor: Colors.color1,
    ...Colors.Shadow,
  }
});
