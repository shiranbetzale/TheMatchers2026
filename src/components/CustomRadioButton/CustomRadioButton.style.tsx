import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  smallBtn: {
    marginTop: GeneralStyle.space / 2
  },
  btn: {
    marginTop: GeneralStyle.space
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
    marginLeft: GeneralStyle.space / 2,
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
    marginLeft: GeneralStyle.space,
  },
  selectedCircle: {
    backgroundColor: Colors.color1,
  }
});