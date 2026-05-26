import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.lg,
    borderRadius: GeneralStyle.radius.md,
    ...Colors.Shadow,
    backgroundColor: Colors.darkGreen,
    borderWidth: 1,
    borderColor: Colors.color1,
    borderBottomWidth: 1,
  },
  countContainer: {
    alignItems: 'center',
    padding: GeneralStyle.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.ivory,
    justifyContent: 'center',
    alignItems: 'center',
    padding: GeneralStyle.spacing.sm,
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
    borderColor: Colors.color1Light,
    ...Colors.Shadow,
  },
});
