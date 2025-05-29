import {StyleSheet} from 'react-native';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingTop: GeneralStyle.space * 2,
    ...FontsStyle.title,
    ...FontsStyle.textCenter,
  },
  whiteCardContainer: {
    verticalAlign: 'center',
    marginVertical: GeneralStyle.space,
  },
  space: {
    marginVertical: GeneralStyle.space,
  },
});
