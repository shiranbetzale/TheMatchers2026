import { StyleSheet } from "react-native";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  switchText: {
    width: "80%"
  },
  smallSwitch: {
    alignItems: "flex-end",
    marginTop: GeneralStyle.space / 2
  },
  text: {
    marginLeft: GeneralStyle.space
  },
  switch: {
    width: "20%"
  }
});