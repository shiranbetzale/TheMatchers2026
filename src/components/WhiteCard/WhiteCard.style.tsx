import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingHorizontal: GeneralStyle.space,
    paddingVertical: GeneralStyle.space,
    ...Colors.Shadow,
    opacity: 0.85,
  }
});
