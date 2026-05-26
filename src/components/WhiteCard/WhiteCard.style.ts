import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.ivory,
    borderRadius: GeneralStyle.radius.md,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderTopWidth: 0,
    borderLeftWidth: 2,
    borderLeftColor: Colors.color1,
    ...Colors.Shadow,
  }
});
