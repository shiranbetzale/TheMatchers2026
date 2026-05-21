import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  tabContainer: {
    width: "100%",
    marginBottom: GeneralStyle.space,
    borderBottomWidth: 1,
    paddingBottom: GeneralStyle.space / 2,
    borderBottomColor: Colors.border,
  },
  tabsRow: {
    alignItems: "center",
  },
  alignLeft: {
    alignSelf: "flex-start",
  },
  alignRight: {
    alignSelf: "flex-end",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  tab: {
    paddingVertical: GeneralStyle.space * 0.9,
    paddingHorizontal: GeneralStyle.space * 2,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 1,
  },
  activeTabTxt: {
    color: Colors.white
  },
  activeTab: {
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.color1,
  },
  tabBorder: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    width: 2,
    height: 48,
    backgroundColor: Colors.color1,
    marginHorizontal: GeneralStyle.space * 2,
  },
  tabText: {
    color: Colors.darkGreen,
  }
});
