import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  whiteCardContainer: {
    marginBottom: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.lg,
  },
  relationshipHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GeneralStyle.spacing.md,
  },
  relationshipTitle: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
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
  statusOptions: {
    gap: GeneralStyle.spacing.sm,
    marginBottom: GeneralStyle.spacing.md,
  },
  statusOption: {
    flex: 1,
    minHeight: GeneralStyle.size.field,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
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
    fontSize: FontSize.small,
  },
  partnerSearchInput: {
    ...FontsStyle.text,
    minHeight: GeneralStyle.size.action,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    color: Colors.black,
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
});
