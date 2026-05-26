import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    gap: GeneralStyle.spacing.sm,
  },
  headerCard: {
    gap: GeneralStyle.spacing.xs,
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
  summaryRow: {
    flexDirection: 'row-reverse',
    gap: GeneralStyle.spacing.sm,
  },
  summaryChip: {
    minWidth: 132,
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: GeneralStyle.spacing.lg,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.champagne,
  },
  summaryValue: {
    ...FontsStyle.menuTitle,
    color: Colors.color1,
    fontSize: 20,
  },
  summaryLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 12,
  },
  dayGroup: {
    gap: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
  },
  dayTitle: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    fontSize: 19,
    textAlign: 'right',
    paddingHorizontal: GeneralStyle.spacing.sm,
  },
  meetingCard: {
    gap: GeneralStyle.spacing.sm,
    borderTopColor: Colors.color1,
  },
  meetingTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: GeneralStyle.spacing.sm,
  },
  meetingMain: {
    flex: 1,
    gap: 2,
  },
  timeBadge: {
    minWidth: 64,
    alignItems: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.navyDeep,
    borderWidth: 1,
    borderColor: Colors.premiumLine,
  },
  timeText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    fontSize: 15,
    textAlign: 'center',
  },
  meetingName: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
    textAlign: 'right',
  },
  meetingDate: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'right',
  },
  detailText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
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
