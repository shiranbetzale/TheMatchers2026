import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = {
  pinChildrenContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  listCard: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
    padding: GeneralStyle.spacing.md,
    marginBottom: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: Colors.color1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.sm,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
  },
  row: {
    flexDirection: 'row' as const,
  },
  rowReverse: {
    flexDirection: 'row-reverse' as const,
  },
  alignLeft: {
    alignItems: 'flex-start' as const,
  },
  alignRight: {
    alignItems: 'flex-end' as const,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden' as const,
    borderWidth: 2,
    borderColor: Colors.borderSoft,
  },
  avatar: {
    width: '100%' as const,
    height: '100%' as const,
  },
  cardInfo: {
    flex: 1,
    gap: GeneralStyle.spacing.xs,
  },
  nameText: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: 18,
  },
  metaText: {
    ...FontsStyle.text,
    color: Colors.slate,
  },
  actions: {
    width: 82,
    gap: GeneralStyle.spacing.xs,
  },
  viewButton: {
    paddingVertical: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.sm,
    backgroundColor: Colors.darkGreen,
  },
  editButton: {
    paddingVertical: GeneralStyle.spacing.xs,
    paddingHorizontal: GeneralStyle.spacing.sm,
    backgroundColor: Colors.color1,
  },
  actionText: {
    ...FontsStyle.text,
    color: Colors.white,
    fontSize: 13,
  },
};
