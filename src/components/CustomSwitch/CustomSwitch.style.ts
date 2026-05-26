import { StyleSheet } from "react-native";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  smallContainer: {
    minHeight: 34,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
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
  textLeft: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  textRight: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  switch: {
    flexShrink: 0,
  },
});
