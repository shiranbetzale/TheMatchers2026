import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  headerWrapper: {
    gap: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.md,
    paddingBottom: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  container: {
    flex: 1,
    gap: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.xl,
  },
  title: {
    ...FontsStyle.wizardTitle,
    color: Colors.darkGreen,
    textAlign: 'right',
  },
  subtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'right',
  },
  sectionCard: {
    gap: GeneralStyle.spacing.md,
  },
  sectionTitle: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.title,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GeneralStyle.spacing.sm,
  },
  statCard: {
    minWidth: '45%',
    flex: 1,
    padding: GeneralStyle.spacing.md,
    borderRadius: GeneralStyle.borderRadius.md,
    backgroundColor: Colors.ivory,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
  },
  statValue: {
    ...FontsStyle.wizardTitle,
    color: Colors.darkGreen,
    textAlign: 'center',
  },
  statLabel: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
    fontSize: FontSize.caption,
  },
  errorText: {
    ...FontsStyle.text,
    color: Colors.error,
    textAlign: 'center',
  },
});
