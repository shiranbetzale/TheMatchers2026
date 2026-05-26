import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.md,
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
  },
  error: {
    backgroundColor: Colors.dangerSoft,
    borderColor: '#E4AAA2',
  },
  warning: {
    backgroundColor: Colors.champagne,
    borderColor: Colors.color1Light,
  },
  info: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderSoft,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  iconBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.color1Light,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    ...FontsStyle.text,
    flex: 1,
    color: Colors.darkGreen,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ltrText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
