import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
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
  },
  subtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
  },
  textRtl: {
    textAlign: 'right',
  },
  textLtr: {
    textAlign: 'left',
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
  matchCard: {
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: GeneralStyle.spacing.sm,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: Colors.transparent,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
    elevation: 0,
  },
  pinChildrenContainer: {
    backgroundColor: Colors.surface,
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
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  actionButtonPrimary: {
    minHeight: 46,
    flex: 1.25,
    borderColor: Colors.premiumLine,
    borderRadius: GeneralStyle.radius.lg,
    backgroundColor: Colors.navyDeep,
    shadowColor: 'rgba(8, 24, 52, 0.18)',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
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
    fontSize: 13,
    textAlign: 'center',
  },
  actionTextPrimary: {
    color: Colors.ivory,
    fontSize: 14,
  },
  actionIconPrimary: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.goldWash,
  },
  actionTextActive: {
    color: Colors.goldDark,
  },
});
