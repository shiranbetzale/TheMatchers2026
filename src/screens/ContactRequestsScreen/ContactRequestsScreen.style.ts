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
  statsRow: {
    gap: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.champagne,
  },
  statValue: {
    ...FontsStyle.menuTitle,
    color: Colors.color1,
    fontSize: FontSize.title,
  },
  statLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  listContent: {
    gap: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.xl,
  },
  card: {
    gap: GeneralStyle.spacing.md,
  },
  cardHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  requestName: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.title,
  },
  requestMeta: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: FontSize.caption,
    lineHeight: 19,
  },
  statusBadge: {
    flexShrink: 0,
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.surfaceMuted,
  },
  statusBadgeNew: {
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.goldWash,
  },
  statusBadgeHandled: {
    borderColor: Colors.darkGreen,
    backgroundColor: Colors.successSoft,
  },
  statusText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  messageText: {
    ...FontsStyle.text,
    color: Colors.black,
    lineHeight: 23,
  },
  emailError: {
    ...FontsStyle.text,
    color: Colors.danger,
    fontSize: FontSize.caption,
    textAlign: 'right',
  },
  contactActions: {
    width: '100%',
    gap: GeneralStyle.spacing.sm,
    paddingTop: GeneralStyle.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
  },
  contactAction: {
    flex: 1,
    minHeight: GeneralStyle.size.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.ivory,
  },
  contactActionText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  actions: {
    gap: GeneralStyle.spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: GeneralStyle.size.control,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.white,
  },
  handledButton: {
    borderColor: Colors.darkGreen,
    backgroundColor: Colors.darkGreen,
  },
  actionButtonDisabled: {
    opacity: 0.48,
  },
  actionButtonText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlign: 'center',
  },
  handledButtonText: {
    ...FontsStyle.text,
    color: Colors.white,
    textAlign: 'center',
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
