import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  whiteCardContainer: {
    marginBottom: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.premiumLine,
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderSoft,
  },
  relationshipHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.md,
  },
  relationshipTitle: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
  },
  relationshipBadge: {
    ...FontsStyle.text,
    color: Colors.goldDark,
    backgroundColor: Colors.goldWash,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingVertical: GeneralStyle.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.color1Light,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  statusOptions: {
    gap: GeneralStyle.spacing.sm,
    marginBottom: GeneralStyle.spacing.md,
  },
  statusOption: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  statusOptionActive: {
    backgroundColor: Colors.navyDeep,
    borderColor: Colors.premiumLine,
  },
  statusOptionText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
    textAlign: 'center',
  },
  statusOptionTextActive: {
    color: Colors.white,
  },
  disabledOption: {
    opacity: 0.75,
  },
  partnerSearchContainer: {
    gap: GeneralStyle.spacing.xs,
  },
  partnerSearchLabel: {
    ...FontsStyle.textDecoration,
    color: Colors.darkGreen,
    fontSize: 15,
  },
  partnerSearchInput: {
    ...FontsStyle.text,
    minHeight: 52,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.ivory,
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
  emptySuggestion: {
    ...FontsStyle.text,
    color: Colors.slate,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
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
