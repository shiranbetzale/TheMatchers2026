import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
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
    fontSize: FontSize.title,
  },
  statLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
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
  matchCardWrapper: {
    position: 'relative',
  },
  deleteCandidateButton: {
    position: 'absolute',
    left: GeneralStyle.spacing.sm,
    top: GeneralStyle.spacing.sm,
    width: GeneralStyle.size.iconLarge,
    height: GeneralStyle.size.iconLarge,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.dangerSoft,
    zIndex: 2,
  },
  pinChildrenContainer: {
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
});
