import {StyleSheet} from 'react-native';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';

export const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.md,
    backgroundColor: Colors.ivory,
  },
  container: {
    flex: 1,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.sm,
  },
  title: {
    ...FontsStyle.wizardTitle,
    color: '#102A56',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.md,
    gap: GeneralStyle.spacing.sm,
  },
  headerRowRtl: {
    flexDirection: 'row-reverse',
  },
  headerRowLtr: {
    flexDirection: 'row',
  },
  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#CFD7E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: GeneralStyle.spacing.sm,
    ...FontsStyle.text,
    color: '#102A56',
    backgroundColor: '#fff',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B9C4D3',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: GeneralStyle.spacing.xl,
    gap: GeneralStyle.spacing.sm,
  },
  list: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#E3E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: GeneralStyle.spacing.md,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: GeneralStyle.spacing.md,
  },
  viewRowRtl: {
    flexDirection: 'row-reverse',
  },
  viewRowLtr: {
    flexDirection: 'row',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  primaryText: {
    ...FontsStyle.subTitle,
    fontSize: 22,
    color: '#102A56',
  },
  secondaryText: {
    ...FontsStyle.text,
    color: '#2F3A4D',
  },
  metaText: {
    ...FontsStyle.text,
    fontSize: 13,
    color: '#708099',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionRowRtl: {
    flexDirection: 'row-reverse',
  },
  actionRowLtr: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  deleteButton: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  saveButton: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  cancelButton: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  deleteIcon: {
    fontSize: 16,
  },
  editorContainer: {
    gap: 8,
  },
  editorTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  editorTopActionsRtl: {
    alignSelf: 'flex-start',
  },
  editorTopActionsLtr: {
    alignSelf: 'flex-end',
  },
  actionsSideRtl: {
    marginLeft: 10,
  },
  actionsSideLtr: {
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFD7E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    ...FontsStyle.text,
    color: '#102A56',
    backgroundColor: '#fff',
  },
  inputLabel: {
    ...FontsStyle.text,
    fontSize: 13,
    color: '#51607A',
    marginTop: 2,
  },
  inputRtl: {
    textAlign: 'right',
  },
  inputLtr: {
    textAlign: 'left',
  },
  choiceRow: {
    gap: 6,
  },
  choiceLabel: {
    ...FontsStyle.text,
    fontSize: 13,
    color: '#51607A',
  },
  choiceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceOptionsRtl: {
    flexDirection: 'row-reverse',
  },
  choiceOptionsLtr: {
    flexDirection: 'row',
  },
  choiceChip: {
    borderWidth: 1,
    borderColor: '#CFD7E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  choiceChipActive: {
    borderColor: '#0F2E63',
    backgroundColor: '#EAF1FF',
  },
  choiceChipText: {
    ...FontsStyle.text,
    fontSize: 13,
    color: '#364259',
  },
  choiceChipTextActive: {
    color: '#0F2E63',
  },
  textRtl: {
    textAlign: 'right',
  },
  textLtr: {
    textAlign: 'left',
  },
});
