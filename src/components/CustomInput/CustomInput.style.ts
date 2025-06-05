import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import { FontsStyle } from "../../utils/FontsStyle";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between"
  },
  smallContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  input: {
    marginRight: GeneralStyle.space,
    padding: GeneralStyle.space,
    width: 200,
  },
  smallInput: {
    padding: GeneralStyle.space / 2,
    width: 150,
    marginTop: GeneralStyle.space / 2,
  },
  baseInput: {
    borderWidth: 2,
    borderColor: Colors.color1,
    borderRadius: 4,
    ...FontsStyle.text
  },
  textArea: {
    height: 140,
    width: "100%",
    marginTop: GeneralStyle.space,
    marginRight: 0
  },
  textAreaContainer: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  maxWidth: {
    maxWidth: 100
  }
});