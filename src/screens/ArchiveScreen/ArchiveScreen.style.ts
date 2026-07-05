import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  pinChildrenContainer: {
    width: '100%',
    backgroundColor: Colors.ivory,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  actionsBar: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
  },
  actionsBarRtl: {
    flexDirection: 'row-reverse',
  },
  actionsBarLtr: {
    flexDirection: 'row',
  },
  actionButton: {
    minHeight: GeneralStyle.size.control,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
  },
  actionButtonActive: {
    borderColor: Colors.color1,
    backgroundColor: Colors.goldWash,
  },
  actionButtonRtl: {
    flexDirection: 'row-reverse',
  },
  actionButtonLtr: {
    flexDirection: 'row',
  },
  actionText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  actionTextActive: {
    color: Colors.goldDark,
  },

  restoreButton: {
    width: '100%',
    minHeight: GeneralStyle.size.control,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    backgroundColor: Colors.white,
    borderColor: Colors.premiumLine,
    shadowOpacity: 0,
    elevation: 0,
  },
  restoreButtonRtl: {
    flexDirection: 'row-reverse',
  },
  restoreButtonLtr: {
    flexDirection: 'row',
  },
  restoreButtonText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
  },
  container: {
    gap: GeneralStyle.spacing.md,
  },
  headerCard: {
    gap: GeneralStyle.spacing.xs,
  },
  title: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
    textAlign: 'right',
  },
  subtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: GeneralStyle.spacing.sm,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.sm,
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
  archiveCard: {
    gap: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.sm,
    backgroundColor: Colors.white,
  },
  relationshipBar: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.sm,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.goldWash,
  },
  relationshipBarRtl: {
    flexDirection: 'column',
  },
  relationshipBarLtr: {
    flexDirection: 'column',
  },
  relationshipTextBlock: {
    gap: 4,
  },
  badgesRow: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
    flexShrink: 0,
  },
  badgesRowRtl: {
    flexDirection: 'row-reverse',
  },
  badgesRowLtr: {
    flexDirection: 'row',
  },
  relationshipText: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    fontSize: FontSize.large,
    width: '100%',
  },
  textRtl: {
    textAlign: 'right',
  },
  textLtr: {
    textAlign: 'left',
  },
  relationshipBadge: {
    ...FontsStyle.text,
    color: Colors.goldDark,
    textAlign: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.color1Light,
    borderRadius: 999,
    backgroundColor: Colors.goldWash,
    overflow: 'hidden',
  },
  externalPartnerBadge: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: 999,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  emptyCard: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
  },
  emptyTitle: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
    textAlign: 'center',
  },
  emptyText: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
  },
});
