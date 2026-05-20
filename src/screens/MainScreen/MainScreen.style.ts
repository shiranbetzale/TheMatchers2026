import {ViewStyle} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = {
  container: {
    marginBottom: GeneralStyle.space * 2,
  } satisfies ViewStyle,
  txt: {
    marginVertical: GeneralStyle.space,
  } satisfies ViewStyle,
  matchCard: (border: string, bg: string) => ({
    padding: 0,
    marginBottom: GeneralStyle.space,
    borderWidth: 5,
    borderColor: border,
    backgroundColor: bg,
  } satisfies ViewStyle),
  shortButtons: {
    marginBottom: GeneralStyle.space,
    flexDirection: 'row-reverse',
  } satisfies ViewStyle,
  name: {
    ...FontsStyle.menuTitle,
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
  },
  btn: {
    margin: GeneralStyle.space / 2,
  } satisfies ViewStyle,
};
