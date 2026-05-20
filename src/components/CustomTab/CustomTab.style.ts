import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  tabContainer: {
    marginBottom: GeneralStyle.space,
    borderBottomWidth: 2,
    paddingBottom: GeneralStyle.space / 2,
    borderBottomColor: Colors.darkGreen,
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  tab: {
    paddingVertical: GeneralStyle.space,
    paddingHorizontal: GeneralStyle.space * 2,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 1,
  },
  borderLeft: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.darkGreen,
  },
  activeTabTxt: {
    color: Colors.white
  },
  activeTab: {
    backgroundColor: Colors.color1
  },
  tabBorder: {
  },
  tabBorderLtr: {
    flexDirection: "row",
    marginLeft: GeneralStyle.space,
  },
  tabBorderRtl: {
    flexDirection: "row-reverse",
    marginRight: GeneralStyle.space,
  },
  separatorLtr: {
    marginLeft: GeneralStyle.space,
  },
  separatorRtl: {
    marginRight: GeneralStyle.space,
  },
  tabText: {
    color: Colors.darkGreen,
  }
});
