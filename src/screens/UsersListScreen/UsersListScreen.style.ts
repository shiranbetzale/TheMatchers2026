import {StyleSheet} from 'react-native';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingTop: GeneralStyle.spacing.sm * 2,
    ...FontsStyle.title,
  },
  whiteCardContainer: {
    marginVertical: GeneralStyle.spacing.sm,
  },
  space: {
    marginVertical: GeneralStyle.spacing.sm,
  },
});
