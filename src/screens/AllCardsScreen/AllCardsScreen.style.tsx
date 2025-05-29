import {StyleSheet, ViewStyle} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

type Style = {
  matchCard: any;
  pinChildrenContainer: any;
};

export const styles = StyleSheet.create<Style>({
  matchCard: (color: string) => ({
    padding: 0,
    marginBottom: GeneralStyle.space,
    borderWidth: 5,
    backgroundColor: Colors.white,
    borderColor: color,
  }),
  pinChildrenContainer: {
    backgroundColor: Colors.white,
  },
});
