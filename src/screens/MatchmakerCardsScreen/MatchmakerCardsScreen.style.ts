import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = {
  matchCard: (color: string) => ({
    padding: 0,
    marginBottom: GeneralStyle.space,
    borderWidth: 1,
    borderLeftWidth: 5,
    backgroundColor: Colors.surface,
    borderColor: color,
    borderRadius: 18,
  }),
  pinChildrenContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
};
