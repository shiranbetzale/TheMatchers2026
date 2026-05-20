import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: GeneralStyle.space * 1.5,
    paddingVertical: GeneralStyle.space * 1.2,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.Shadow,
  }
});
