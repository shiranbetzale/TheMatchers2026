import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
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
    borderColor: Colors.danger,
  },
  warning: {
    backgroundColor: Colors.champagne,
    borderColor: Colors.color1Light,
  },
  info: {
    backgroundColor: Colors.ivory,
    borderColor: Colors.borderSoft,
  },
  iconBadge: {
    width: GeneralStyle.size.iconSm,
    height: GeneralStyle.size.iconSm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.color1Light,
  },
  icon: {
    fontSize: FontSize.small,
  },
  text: {
    ...FontsStyle.text,
    flex: 1,
    color: Colors.darkGreen,
  },
});
