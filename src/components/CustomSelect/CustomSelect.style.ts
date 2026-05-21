import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: GeneralStyle.space,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  select: {
    minWidth: 180,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: GeneralStyle.space,
    paddingVertical: GeneralStyle.space,
  },
  readOnlySelect: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  selectText: {
    ...FontsStyle.text,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.space * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  optionsContainer: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: Colors.white,
    ...Colors.Shadow,
  },
  option: {
    paddingHorizontal: GeneralStyle.space * 1.5,
    paddingVertical: GeneralStyle.space * 1.2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    ...FontsStyle.text,
    textAlign: 'center',
  },
});
