import { StyleSheet } from "react-native";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
  },
  dateContainer: {
    marginLeft: GeneralStyle.space,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  datePickerBtn: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginRight: GeneralStyle.space
  }
});