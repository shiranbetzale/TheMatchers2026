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
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.sm,
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
  listContent: {
    gap: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.xl,
  },
  card: {
    gap: GeneralStyle.spacing.xs,
  },
  cardHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  actionText: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.title,
  },
  dateText: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: FontSize.caption,
  },
  messageText: {
    ...FontsStyle.text,
    color: Colors.black,
    lineHeight: 22,
  },
  metaText: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: FontSize.caption,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: GeneralStyle.spacing.xl,
  },
  emptyText: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
  },
});
