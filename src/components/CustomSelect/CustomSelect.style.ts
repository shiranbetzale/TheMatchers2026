import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

const {height} = Dimensions.get('window');
const SELECT_MODAL_MAX_HEIGHT = Math.min(height * 0.56, 430);

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
    minHeight: GeneralStyle.size.field,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 5,
  },
  select: {
    flex: 1,
    minWidth: 0,
    minHeight: GeneralStyle.size.control,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.borderSoft,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
  },
  selectColumn: {
    flex: 0,
    width: '100%',
    minHeight: GeneralStyle.size.control,
    paddingVertical: GeneralStyle.spacing.xs,
  },
  readOnlySelect: {
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.surfaceMuted,
  },
  selectText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  selectContent: {
    minHeight: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GeneralStyle.spacing.xs,
  },
  selectContentText: {
    flex: 1,
  },
  clearButton: {
    width: GeneralStyle.size.iconXs,
    height: GeneralStyle.size.iconXs,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  clearButtonText: {
    ...FontsStyle.text,
    color: Colors.inkMuted,
    lineHeight: 20,
  },
  labelWrapper: {
    width: '42%',
    minWidth: GeneralStyle.size.label,
    flexShrink: 0,
  },
  labelWrapperColumn: {
    width: '100%',
    minWidth: 0,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: GeneralStyle.spacing.xl,
    backgroundColor: Colors.overlay,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: GeneralStyle.size.modal,
    maxHeight: SELECT_MODAL_MAX_HEIGHT,
    overflow: 'hidden',
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  inlineOptionsContainer: {
    width: '100%',
    maxHeight: GeneralStyle.size.options,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
  },
  option: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
    minHeight: GeneralStyle.size.field,
    justifyContent: 'center',
  },
  optionText: {
    ...FontsStyle.text,
  },
});
