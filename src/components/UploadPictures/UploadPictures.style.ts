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
    backgroundColor: Colors.surfaceElevated,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21,25,35,0.72)',
  },
  removeText: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 20,
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
