import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...FontsStyle.title,
    marginBottom: GeneralStyle.spacing.sm,
  },
  subtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
    marginBottom: GeneralStyle.spacing.lg,
    textAlign: 'center',
  },
  card: {
    alignSelf: 'center',
    maxWidth: 560,
  },
  field: {
    marginBottom: GeneralStyle.spacing.sm,
  },
});
