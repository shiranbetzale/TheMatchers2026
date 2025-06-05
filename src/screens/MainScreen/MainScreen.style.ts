import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

type Style = {
  container: any;
  txt: any;
  matchCard: any;
  shortButtons: any;
  name: any;
  btn: any;
};

export const styles = StyleSheet.create<Style>({
  container: {
    marginBottom: GeneralStyle.space * 2,
  },
  txt: {
    marginVertical: GeneralStyle.space,
  },
  matchCard: (color: string) => ({
    padding: 0,
    marginBottom: GeneralStyle.space,
    borderWidth: 5,
    borderColor: color,
    backgroundColor: Colors.white,
  }),
  shortButtons: {
    marginBottom: GeneralStyle.space,
    flexDirection: 'row-reverse',
  },
  name: {
    ...FontsStyle.menuTitle,
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
  },
  btn: {
    margin: GeneralStyle.space / 2,
  },
});
