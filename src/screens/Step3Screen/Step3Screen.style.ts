import {StyleSheet} from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: GeneralStyle.spacing.md,
  },
  headerAction: {
    minHeight: GeneralStyle.size.control,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.sm,
  },
});
