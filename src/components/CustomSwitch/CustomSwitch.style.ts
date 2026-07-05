import { StyleSheet } from "react-native";
import GeneralStyle from "../../utils/GeneralStyle";
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  smallContainer: {
    minHeight: GeneralStyle.size.icon,
  },
  switchText: {
    flex: 1,
    minWidth: 0,
  },
  smallSwitch: {
    flexShrink: 0,
  },
  text: {
    flexShrink: 1,
    width: '100%',
  },
  switch: {
    flexShrink: 0,
  },
});
