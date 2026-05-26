import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

const {height} = Dimensions.get('window');
const filterHeight = Math.min(height * 0.68, 560);

export const styles = StyleSheet.create({
  container: {
    height: filterHeight,
    padding: GeneralStyle.spacing.sm,
    backgroundColor: Colors.appBg,
  },
  panel: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    overflow: 'hidden',
    ...Colors.Shadow,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  title: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    textAlign: 'right',
  },
  fieldsScroll: {
    flex: 1,
  },
  fields: {
    gap: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingTop: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.md,
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  actionButton: {
    flex: 1,
    borderRadius: GeneralStyle.radius.sm,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.emerald,
  },
  actionButtonText: {
    ...FontsStyle.text,
    color: Colors.white,
  },
  resetButton: {
    flex: 1,
    borderRadius: GeneralStyle.radius.sm,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
    borderColor: Colors.borderSoft,
  },
  resetButtonText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  filterField: {
    width: '100%',
    minHeight: 64,
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  rangeField: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.md,
  },
});
