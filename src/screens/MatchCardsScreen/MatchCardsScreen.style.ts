import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

const sheet = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  svContainer: {
    padding: GeneralStyle.spacing.sm,
  },
  pinContainer: {
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingTop: GeneralStyle.spacing.xs,
    paddingBottom: GeneralStyle.spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
    marginBottom: GeneralStyle.spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  title: {
    ...FontsStyle.menuTitle,
    fontSize: 20,
    color: Colors.darkGreen,
  },
  subtitle: {
    ...FontsStyle.text,
    color: Colors.slate,
    marginTop: GeneralStyle.spacing.xs,
  },
  countBadge: {
    minWidth: 64,
    alignItems: 'center',
    paddingVertical: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.champagne,
    borderTopWidth: 0,
    borderLeftWidth: 3,
    borderLeftColor: Colors.color1,
  },
  countText: {
    ...FontsStyle.menuTitle,
    fontSize: 20,
    color: Colors.color1,
  },
  countLabel: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 12,
  },
  calendarButton: {
    marginBottom: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.color1,
  },
  calendarButtonText: {
    ...FontsStyle.text,
    color: Colors.ivory,
  },
  sectionHeader: {
    marginBottom: GeneralStyle.spacing.sm,
  },
  sectionTitle: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
  },
  card: {
    marginBottom: GeneralStyle.spacing.sm,
  },
  meetingPanel: {
    gap: GeneralStyle.spacing.sm,
    marginTop: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 16,
  },
  meetingStatusRow: {
    gap: GeneralStyle.spacing.sm,
  },
  statusButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: GeneralStyle.radius.md,
    shadowOpacity: 0,
    elevation: 0,
  },
  statusButtonActive: {
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.color1,
  },
  statusButtonText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  statusButtonTextActive: {
    color: Colors.ivory,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.color1,
  },
  meetingField: {
    minHeight: 48,
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  meetingIconBox: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.color1Light,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.goldSoft,
  },
  meetingFieldText: {
    ...FontsStyle.text,
    flex: 1,
    color: Colors.darkGreen,
  },
  meetingTimeText: {
    textAlign: 'right',
    writingDirection: 'ltr',
  },
  meetingInput: {
    ...FontsStyle.text,
    flex: 1,
    minHeight: 44,
    color: Colors.darkGreen,
    paddingVertical: 0,
  },
  selectFieldContainer: {
    width: '100%',
  },
  invalidMeetingField: {
    borderColor: '#DFA097',
    backgroundColor: '#FFF5F1',
  },
  validationText: {
    ...FontsStyle.text,
    color: '#9F4239',
    fontSize: 12,
    textAlign: 'right',
  },
  availableMessage: {
    padding: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.champagne,
  },
  availableMessageText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: GeneralStyle.spacing.md,
    backgroundColor: Colors.overlay,
  },
  meetingModal: {
    gap: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.md,
    borderRadius: GeneralStyle.radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.xs,
  },
  modalTitle: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: 22,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.surfaceElevated,
  },
  modalCloseText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    fontSize: 24,
    lineHeight: 28,
  },
  modalSaveButton: {
    marginTop: GeneralStyle.spacing.xs,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.color1,
  },
  modalSaveText: {
    ...FontsStyle.text,
    color: Colors.ivory,
  },
  inlineTimePicker: {
    gap: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.sm,
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.surfaceElevated,
  },
  timePickerValue: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: 30,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  timePickerColumns: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.md,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
  },
  timePickerSeparator: {
    width: 1,
    height: 104,
    backgroundColor: Colors.borderSoft,
  },
  timePickerLabel: {
    ...FontsStyle.text,
    color: Colors.slate,
    textAlign: 'center',
  },
  timePickerButton: {
    width: 48,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
    borderColor: Colors.color1Light,
    backgroundColor: Colors.goldSoft,
  },
  timePickerButtonText: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 24,
    lineHeight: 28,
  },
  timePickerPart: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: 26,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  timePickerConfirmButton: {
    marginTop: GeneralStyle.spacing.xs,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.color1,
  },
});

export const styles = sheet;
