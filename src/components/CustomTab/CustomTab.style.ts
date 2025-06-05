import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";

export const styles = StyleSheet.create({
  tabContainer: {
    marginBottom: GeneralStyle.space,
    flexDirection: 'row-reverse',
    borderBottomWidth: 2,
    paddingBottom: GeneralStyle.space / 2,
    borderBottomColor: Colors.darkGreen,
  },
  tab: {
    paddingVertical: GeneralStyle.space,
    paddingHorizontal: GeneralStyle.space * 2,
    backgroundColor: Colors.white,
    ...Colors.Shadow,
    margin: 1,
  },
  borderLeft: {
    borderLeftWidth: 2,
    marginRight: GeneralStyle.space,
    borderLeftColor: Colors.darkGreen,
  },
  activeTabTxt: {
    color: Colors.darkGreen
  },
  activeTab: {
    backgroundColor: Colors.color1
  },
  tabBorder: {
    flexDirection: 'row-reverse',
    marginRight: GeneralStyle.space,
  }
});