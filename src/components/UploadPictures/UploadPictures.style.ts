import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    gap: GeneralStyle.spacing.md,
    padding: GeneralStyle.spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: GeneralStyle.spacing.sm,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    borderRadius: GeneralStyle.radius.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GeneralStyle.spacing.sm,
    justifyContent: 'flex-end',
  },
  tile: {
    width: '31%',
    aspectRatio: 0.78,
    borderRadius: GeneralStyle.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  previewButton: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: GeneralStyle.size.iconSm,
    height: GeneralStyle.size.iconSm,
    borderRadius: GeneralStyle.size.iconSm / 2,
    borderWidth: 1,
    borderColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  emptyState: {
    minHeight: 160,
    borderRadius: GeneralStyle.radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    padding: GeneralStyle.spacing.lg,
  },
  emptyText: {
    color: Colors.slate,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
  },
});
