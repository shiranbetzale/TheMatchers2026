import { StyleSheet } from "react-native";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "column-reverse",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: GeneralStyle.space,
  },
  checkbox: {
    alignSelf: "center",
    marginLeft: GeneralStyle.space,
  },
  label: {
    margin: GeneralStyle.space,
  },
});