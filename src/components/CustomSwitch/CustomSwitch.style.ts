import { StyleSheet } from "react-native";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  switchText: {
    width: "80%"
  },
  smallSwitch: {
    marginTop: GeneralStyle.spacing.sm / 2
  },
  text: {
    marginHorizontal: GeneralStyle.spacing.sm
  },
  textLeft: {
    textAlign: "left",
  },
  textRight: {
    textAlign: "right",
  },
  switch: {
    width: "20%"
  }
});
