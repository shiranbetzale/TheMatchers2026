import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import {FontsStyle} from "../../utils/FontsStyle";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: "center",
    justifyContent: "space-between",
    gap: GeneralStyle.spacing.sm,
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  labelWrapper: {
    flex: 0.42,
    minWidth: 92,
    flexShrink: 0,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
  },
  dateContainer: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: GeneralStyle.spacing.sm,
    minHeight: 46,
  },
  dateText: {
    flex: 1,
    minWidth: 0,
    color: Colors.darkGreen,
  },
  datePickerBtn: {
    backgroundColor: Colors.goldSoft,
    borderRadius: GeneralStyle.radius.sm,
    padding: 0,
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.color1Light,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
