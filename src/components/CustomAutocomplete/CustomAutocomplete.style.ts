import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    gap: GeneralStyle.spacing.sm,
    zIndex: 20,
  },
  smallContainer: {
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    position: 'relative',
    zIndex: 20,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  labelWrapper: {
    width: '42%',
    minWidth: 104,
    flexShrink: 0,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
  },
  inputWrapper: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
    zIndex: 100,
  },
  input: {
    width: '100%',
    minHeight: 44,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
  },
  smallInput: {
    width: '100%',
    minHeight: 40,
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    marginTop: GeneralStyle.spacing.xs,
  },
  baseInput: {
    ...FontsStyle.text,
    color: Colors.black,
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  readOnlyInput: {
    backgroundColor: Colors.surfaceMuted,
    color: Colors.slate,
  },
  suggestionsPanel: {
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    width: '100%',
    maxHeight: 220,
    marginTop: GeneralStyle.spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
    zIndex: 1000,
    elevation: 24,
  },
  suggestionItem: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    minHeight: 48,
    justifyContent: 'center',
  },
  suggestionText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  textRight: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  textLeft: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  emptyItem: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.md,
  },
  emptyText: {
    ...FontsStyle.text,
    color: Colors.slate,
  },
});
