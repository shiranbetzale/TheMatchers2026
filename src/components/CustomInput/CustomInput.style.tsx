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
  input: {
    marginRight: GeneralStyle.space,
    borderWidth: 2,
    padding: GeneralStyle.space,
    width: 200,
    borderColor: Colors.border,
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
    maxWidth: 150
  }
});