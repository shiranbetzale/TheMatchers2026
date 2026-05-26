import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  smallBtn: {
    marginTop: GeneralStyle.spacing.sm / 2
  },
  btn: {
    marginTop: GeneralStyle.spacing.sm
  },
  optionsContainer: {
    alignContent: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  smallCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: GeneralStyle.spacing.sm / 2,
  },
  baseCircle: {
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    borderWidth: 2,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: GeneralStyle.spacing.sm,
  },
  selectedCircle: {
    backgroundColor: Colors.color1,
  }
});