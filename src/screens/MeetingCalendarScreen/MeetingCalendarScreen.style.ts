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
    alignItems: 'flex-start',
    gap: GeneralStyle.spacing.sm,
  },
  meetingTopRowRtl: {
    flexDirection: 'row',
  },
  meetingTopRowLtr: {
    flexDirection: 'row-reverse',
  },
  editMeetingButton: {
    width: 40,
    height: 40,
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.surfaceElevated,
  },
  meetingMain: {
    flex: 1,
    gap: 2,
  },
  timeBadge: {
    minWidth: 125,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.navyDeep,
    borderWidth: 1,
    borderColor: Colors.premiumLine,
  },
  timeLabel: {
    ...FontsStyle.subTitle,
    color: Colors.ivory,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  timeText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    fontSize: 18,
    textAlign: 'center',
    writingDirection: 'ltr',
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
  detailLabel: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    textAlign: 'right',
    fontSize: 16,
  },
  detailValue: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlign: 'right',
    fontSize: 16,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: GeneralStyle.spacing.lg,
    backgroundColor: Colors.overlay,
  },
  modalScroll: {
    width: '100%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: GeneralStyle.spacing.xl,
  },
  editModal: {
    width: '100%',
    gap: GeneralStyle.spacing.md,
    padding: GeneralStyle.spacing.lg,
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  modalHeaderRtl: {
    flexDirection: 'row',
  },
  modalHeaderLtr: {
    flexDirection: 'row-reverse',
  },
  modalTitle: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: 22,
    textAlign: 'right',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  modalCloseText: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
    textAlign: 'center',
  },
  modalField: {
    gap: GeneralStyle.spacing.xs,
  },
  modalFieldLabel: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 15,
  },
  modalInputBox: {
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  modalInputText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  modalTextInput: {
    minHeight: 46,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.surfaceElevated,
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  validationText: {
    ...FontsStyle.text,
    color: Colors.danger,
    fontSize: 13,
  },
  modalActions: {
    gap: GeneralStyle.spacing.sm,
  },
  modalActionsRtl: {
    flexDirection: 'row',
  },
  modalActionsLtr: {
    flexDirection: 'row-reverse',
  },
  saveButton: {
    flex: 1,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.navyDeep,
    borderColor: Colors.premiumLine,
  },
  saveButtonText: {
    ...FontsStyle.text,
    color: Colors.white,
  },
  cancelButton: {
    flex: 1,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    borderColor: Colors.borderSoft,
  },
  cancelButtonText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  textLtr: {
    textAlign: 'left',
    writingDirection: 'ltr',
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
