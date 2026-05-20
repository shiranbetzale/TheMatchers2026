import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import { FontsStyle } from "../../utils/FontsStyle";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
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
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    ...FontsStyle.text
  },
  ltrInput: {
    writingDirection: 'ltr',
  },
  rtlInput: {
    writingDirection: 'rtl',
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
  },
  toggleSecure: {
    position: "absolute",
    right: GeneralStyle.space,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: GeneralStyle.space / 2,
  },
  toggleSecureRtl: {
    left: GeneralStyle.space,
    right: undefined,
  },
  toggleSecureText: {
    ...FontsStyle.text,
    fontSize: 14,
    color: Colors.darkGreen,
  }
});
