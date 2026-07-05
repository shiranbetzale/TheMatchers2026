import {Dimensions, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import Colors from '../utils/Colors';
import {FontsStyle} from '../utils/FontsStyle';
import GeneralStyle from '../utils/GeneralStyle';

const panelHeight = Math.min(Dimensions.get('window').height * 0.68, 560);

const base = {
  container: {
    height: panelHeight,
    padding: GeneralStyle.spacing.sm,
    backgroundColor: Colors.appBg,
  },
  panel: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  header: {
    alignItems: 'flex-end',
    padding: GeneralStyle.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  title: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    textAlign: 'right',
  },
  fieldsScroll: {flex: 1},
  actions: {
    flexDirection: 'row-reverse',
    gap: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  actionButtonText: {...FontsStyle.text, color: Colors.white},
  resetButtonText: {...FontsStyle.text, color: Colors.darkGreen},
} satisfies Record<string, ViewStyle | TextStyle>;

const actionButton = {
  flex: 1,
  paddingVertical: GeneralStyle.spacing.sm,
};

export const filterStyles = StyleSheet.create({
  ...base,
  fields: {
    gap: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingTop: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.md,
  },
  actionButton: {
    ...actionButton,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.darkGreen,
  },
  resetButton: {
    ...actionButton,
    borderRadius: GeneralStyle.radius.sm,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
  filterField: {
    width: '100%',
    minHeight: GeneralStyle.size.badge,
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
  },
  rangeField: {
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.md,
  },
});

export const orderByStyles = StyleSheet.create({
  ...base,
  fields: {
    gap: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.sm,
    paddingBottom: GeneralStyle.spacing.md,
  },
  field: {
    width: '100%',
    padding: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
  },
  actionButton: {
    ...actionButton,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.darkGreen,
  },
  resetButton: {
    ...actionButton,
    borderRadius: GeneralStyle.radius.md,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
  },
});
