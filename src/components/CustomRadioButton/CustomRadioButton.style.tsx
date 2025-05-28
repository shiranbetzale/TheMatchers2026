import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  btn: {
    marginTop: GeneralStyle.space
  },
  optionsContainer: {
    alignContent: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    marginLeft: GeneralStyle.space,
    borderColor: Colors.black,
    borderWidth: 2,
  },
  selectedCircle: {
    backgroundColor: Colors.border,
  }
});