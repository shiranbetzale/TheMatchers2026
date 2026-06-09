import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  pinChildrenContainer: {
    width: '100%',
  },

  restoreIconButton: {
    position: 'absolute',
    bottom: GeneralStyle.spacing.sm,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.color1Light,
    borderRadius: 20,
    backgroundColor: Colors.champagne,
    ...Colors.Shadow,
  },
  restoreIconButtonRtl: {
    left: GeneralStyle.spacing.md,
  },
  restoreIconButtonLtr: {
    right: GeneralStyle.spacing.md,
  },
  matchCardWithRestore: {
    position: 'relative',
  },
  container: {
    gap: GeneralStyle.spacing.md,
  },
  headerCard: {
    gap: GeneralStyle.spacing.xs,
    borderTopWidth: 3,
    borderTopColor: Colors.premiumLine,
  },
  title: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: 24,
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
    fontSize: 20,
  },
  statLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 12,
    textAlign: 'center',
  },
  cardBlock: {
    gap: GeneralStyle.spacing.xs,
    marginBottom: GeneralStyle.spacing.sm,
  },
  relationshipBar: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    overflow: 'hidden',
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
    fontSize: 18,
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
    backgroundColor: Colors.surfaceElevated,
    overflow: 'hidden',
  },
  emptyCard: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
  },
  emptyTitle: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyText: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
  },
});
