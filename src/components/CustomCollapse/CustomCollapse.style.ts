import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import {CardBorderStyle} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: GeneralStyle.spacing.sm,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  contentContainer: {
    paddingTop: GeneralStyle.spacing.md,
    paddingBottom: GeneralStyle.spacing.xl * 4,
    overflow: 'visible',
  },
  requiredFieldsNote: {
    ...FontsStyle.text,
    color: Colors.inkMuted,
    fontSize: FontSize.small,
    marginBottom: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.xs,
  },
  whiteCardContainer: {
    ...CardBorderStyle,
    marginBottom: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.md,
    backgroundColor: Colors.white,
    overflow: 'visible',
    zIndex: 1,
  },
  autocompleteCard: {
    zIndex: 50,
    elevation: 12,
  },
  collapseBtn: {
    ...CardBorderStyle,
    alignItems: 'flex-end',
    marginBottom: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
    paddingVertical: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.md,
    ...Colors.Shadow,
    elevation: 4,
  },
  lockedCollapseBtn: {
    opacity: 0.35,
  },
  collapseTitle: {
    ...FontsStyle.menuTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.section,
    textAlign: 'right',
  },
});
