import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

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
    fontSize: FontSize.section,
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
    fontSize: FontSize.title,
  },
  summaryLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: FontSize.caption,
  },
  dayGroup: {
    gap: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
  },
  dayTitle: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
    textAlign: 'right',
    paddingHorizontal: GeneralStyle.spacing.sm,
  },
  meetingCard: {
    gap: GeneralStyle.spacing.sm,
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
    width: GeneralStyle.size.iconLarge,
    height: GeneralStyle.size.iconLarge,
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
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
    fontSize: FontSize.caption,
    textAlign: 'center',
    marginBottom: 2,
  },
  timeText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    fontSize: FontSize.large,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  meetingName: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.large,
    textAlign: 'right',
  },
  meetingNamesRow: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: GeneralStyle.spacing.xs,
  },
  meetingNamesRowRtl: {
    flexDirection: 'row-reverse',
  },
  meetingNamesRowLtr: {
    flexDirection: 'row',
  },
  meetingNameLink: {
    ...FontsStyle.textDecoration,
    color: Colors.info,
    fontSize: FontSize.large,
    textDecorationLine: 'underline',
  },
  meetingNameSeparator: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: FontSize.large,
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
    fontSize: FontSize.body,
  },
  detailValue: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlign: 'right',
    fontSize: FontSize.body,
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
    fontSize: FontSize.heading,
    textAlign: 'right',
  },
  modalCloseButton: {
    width: GeneralStyle.size.icon,
    height: GeneralStyle.size.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.white,
  },
  modalCloseText: {
    ...FontsStyle.subTitle,
    ...SharedStyles.iconGlyphText,
    color: Colors.darkGreen,
  },
  modalField: {
    gap: GeneralStyle.spacing.xs,
  },
  modalFieldLabel: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.small,
  },
  modalInputBox: {
    minHeight: GeneralStyle.size.field,
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.white,
  },
  modalInputText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  modalTextInput: {
    minHeight: GeneralStyle.size.field,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.white,
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  validationText: {
    ...FontsStyle.text,
    color: Colors.danger,
    fontSize: FontSize.caption,
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
