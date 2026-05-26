import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  tabContainer: {
    width: "100%",
    marginBottom: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
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
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.lg,
    backgroundColor: Colors.transparent,
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 0,
    margin: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  activeTabTxt: {
    color: Colors.white
  },
  activeTab: {
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.darkGreen,
  },
  tabBorder: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    width: 1,
    height: 48,
    backgroundColor: Colors.line,
    marginHorizontal: GeneralStyle.spacing.md,
  },
  tabText: {
    color: Colors.darkGreen,
  }
});
