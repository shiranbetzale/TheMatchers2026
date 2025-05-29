import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
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
    backgroundColor: Colors.color1,
    borderRadius: 4,
    padding: 0,
    width: 30,
    height: 30,
    marginRight: GeneralStyle.space
  }
});