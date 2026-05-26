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
    alignItems: 'flex-end',
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
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
  },
  smallInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 40,
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    marginTop: GeneralStyle.spacing.xs,
  },
  baseInput: {
    ...FontsStyle.text,
    color: Colors.black,
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
    top: 52,
    zIndex: 100,
    elevation: 16,
    maxHeight: 230,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  wideSuggestionsPanel: {
    width: '58%',
  },
  smallSuggestionsPanel: {
    width: '58%',
  },
  suggestionsRtl: {
    left: 0,
  },
  suggestionsLtr: {
    right: 0,
  },
  suggestionItem: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
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
});
