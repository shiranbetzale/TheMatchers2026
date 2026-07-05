import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  tabContainer: {
    width: '100%',
    marginBottom: GeneralStyle.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
    backgroundColor: Colors.white,
  },
  tabsRow: {
    width: '100%',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    minHeight: GeneralStyle.size.largeControl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 3,
    borderBottomColor: Colors.transparent,
  },
  activeTabTxt: {
    color: Colors.darkGreen,
  },
  activeTab: {
    backgroundColor: Colors.goldWash,
    borderBottomColor: Colors.premiumLine,
  },
  tabText: {
    ...FontsStyle.textDecoration,
    color: Colors.slate,
  },
});
