import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
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
    fontSize: 20,
  },
  statLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 12,
    textAlign: 'center',
  },
  listContent: {
    gap: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.xl,
  },
  card: {
    gap: GeneralStyle.spacing.md,
    borderTopWidth: 3,
    borderTopColor: Colors.premiumLine,
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
    fontSize: 21,
  },
  requestMeta: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: 13,
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
    borderColor: Colors.emerald,
    backgroundColor: Colors.successSoft,
  },
  statusText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 12,
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
    fontSize: 13,
    textAlign: 'right',
  },
  actions: {
    gap: GeneralStyle.spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  handledButton: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.emerald,
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
  textRight: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  textLeft: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
