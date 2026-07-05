import {StyleSheet} from 'react-native';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';
import SharedStyles, {CardSurfaceStyle} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
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
    color: Colors.darkGreen,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.md,
    gap: GeneralStyle.spacing.sm,
  },
  searchInput: {
    minHeight: GeneralStyle.size.control,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: GeneralStyle.spacing.sm,
    ...FontsStyle.text,
    color: Colors.darkGreen,
    backgroundColor: Colors.white,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: GeneralStyle.spacing.xl,
    gap: GeneralStyle.spacing.sm,
  },
  list: {
    flex: 1,
  },
  card: {
    ...CardSurfaceStyle,
    backgroundColor: Colors.white,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: GeneralStyle.spacing.md,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  primaryText: {
    ...FontsStyle.subTitle,
    fontSize: FontSize.heading,
    color: Colors.darkGreen,
  },
  secondaryText: {
    ...FontsStyle.text,
    color: Colors.slate,
  },
  metaText: {
    ...FontsStyle.text,
    fontSize: FontSize.caption,
    color: Colors.inkMuted,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.softBlue,
  },
  deleteButton: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  saveButton: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.softBlue,
  },
  cancelButton: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.softBlue,
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
    borderColor: Colors.borderSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    ...FontsStyle.text,
    color: Colors.darkGreen,
    backgroundColor: Colors.white,
  },
  inputLabel: {
    ...FontsStyle.text,
    fontSize: FontSize.caption,
    color: Colors.slate,
    marginTop: 2,
  },
  choiceRow: {
    gap: 6,
  },
  choiceLabel: {
    ...FontsStyle.text,
    fontSize: FontSize.caption,
    color: Colors.slate,
  },
  choiceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    minHeight: GeneralStyle.size.control,
    minWidth: GeneralStyle.size.badge,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.white,
  },
  choiceChipActive: {
    borderWidth: 2,
    borderColor: Colors.premiumLine,
    backgroundColor: Colors.navyDeep,
  },
  choiceChipText: {
    ...FontsStyle.text,
    fontSize: FontSize.caption,
    color: Colors.slate,
  },
  choiceChipTextActive: {
    color: Colors.white,
  },
  choiceCheck: {
    ...FontsStyle.textDecoration,
    color: Colors.premiumLine,
  },
});
