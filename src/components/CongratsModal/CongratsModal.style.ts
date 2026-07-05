import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import SharedStyles, {ProfileImageStyle} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: GeneralStyle.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: GeneralStyle.size.modal,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.white,
    padding: GeneralStyle.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.color1,
    ...Colors.Shadow,
  },
  title: {
    ...FontsStyle.title,
    flex: 1,
    color: Colors.color1,
  },
  header: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
  },
  closeIconButton: {
    width: GeneralStyle.size.icon,
    height: GeneralStyle.size.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
  },
  closeIconText: {
    ...FontsStyle.text,
    ...SharedStyles.iconGlyphText,
    color: Colors.darkGreen,
  },
  subtitle: {
    ...FontsStyle.text,
    fontSize: FontSize.large,
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
    width: GeneralStyle.size.media,
    alignItems: 'center',
  },
  image: {
    ...ProfileImageStyle,
    marginBottom: GeneralStyle.spacing.sm,
  },
  name: {
    ...FontsStyle.text,
    textAlign: 'center',
    color: Colors.black,
  },
  plus: {
    ...FontsStyle.title,
    fontSize: FontSize.displayLarge,
    color: Colors.color1,
  },
  button: {
    flex: 1,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.darkGreen,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...FontsStyle.subTitle,
    color: Colors.ivory,
  },
  actions: {
    width: '100%',
    flexDirection: 'row-reverse',
    gap: GeneralStyle.spacing.sm,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
  },
  secondaryButtonText: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
  },
});
