import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

const {height} = Dimensions.get('window');
const SELECT_MODAL_MAX_HEIGHT = Math.min(height * 0.56, 430);

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 5,
  },
  select: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
    borderBottomColor: Colors.borderSoft,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
  },
  selectColumn: {
    flex: 0,
    width: '100%',
    minHeight: 44,
    paddingVertical: GeneralStyle.spacing.xs,
  },
  readOnlySelect: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  selectText: {
    ...FontsStyle.text,
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
    width: 24,
    height: 24,
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
    minWidth: 104,
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
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ltrText: {
    textAlign: 'left',
    writingDirection: 'ltr',
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
    maxWidth: 360,
    maxHeight: SELECT_MODAL_MAX_HEIGHT,
    overflow: 'hidden',
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  inlineOptionsContainer: {
    width: '100%',
    maxHeight: 220,
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
    minHeight: 48,
    justifyContent: 'center',
  },
  optionText: {
    ...FontsStyle.text,
  },
});
