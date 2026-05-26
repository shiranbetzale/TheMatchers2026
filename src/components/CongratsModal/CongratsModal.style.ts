import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontsStyle} from '../../utils/FontsStyle';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: GeneralStyle.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.surfaceElevated,
    padding: GeneralStyle.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.color1,
    ...Colors.Shadow,
  },
  title: {
    ...FontsStyle.title,
    fontSize: 36,
    color: Colors.color1,
  },
  subtitle: {
    ...FontsStyle.text,
    fontSize: 18,
    color: Colors.darkGreen,
    marginBottom: GeneralStyle.spacing.md,
  },
  coupleRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.lg,
  },
  person: {
    width: 120,
    alignItems: 'center',
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: Colors.color1Light,
    marginBottom: GeneralStyle.spacing.sm,
  },
  name: {
    ...FontsStyle.text,
    textAlign: 'center',
    color: Colors.black,
  },
  plus: {
    ...FontsStyle.title,
    fontSize: 30,
    color: Colors.color1,
  },
  button: {
    minWidth: 120,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.darkGreen,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...FontsStyle.subTitle,
    color: Colors.surface,
  },
});
