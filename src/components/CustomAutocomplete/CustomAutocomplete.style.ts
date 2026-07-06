import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
    minHeight: GeneralStyle.size.field,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    gap: GeneralStyle.spacing.sm,
    zIndex: 20,
  },
  smallContainer: {
    width: '100%',
    minHeight: GeneralStyle.size.field,
    alignItems: 'center',
    position: 'relative',
    zIndex: 20,
  },
  labelWrapper: {
    width: '42%',
    minWidth: GeneralStyle.size.label,
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
    minHeight: GeneralStyle.size.control,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
  },
  smallInput: {
    width: '100%',
    minHeight: GeneralStyle.size.iconLarge,
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    marginTop: GeneralStyle.spacing.xs,
  },
  baseInput: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
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
    maxHeight: GeneralStyle.size.options,
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
  suggestionsScroll: {
    maxHeight: GeneralStyle.size.options,
  },
  suggestionsScrollContent: {
    flexGrow: 0,
  },
  inlineSuggestionsPanel: {
    position: 'relative',
    top: undefined,
    right: undefined,
    left: undefined,
    marginTop: GeneralStyle.spacing.xs,
    zIndex: 1,
    elevation: 0,
  },
  suggestionItem: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    minHeight: GeneralStyle.size.field,
    justifyContent: 'center',
  },
  suggestionText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
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
