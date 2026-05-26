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
    marginLeft: GeneralStyle.spacing.sm,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  datePickerBtn: {
    backgroundColor: Colors.goldSoft,
    borderRadius: GeneralStyle.radius.sm,
    padding: 0,
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.color1Light,
    marginRight: GeneralStyle.spacing.sm
  }
});
