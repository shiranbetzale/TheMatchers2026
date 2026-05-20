import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = {
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
};
