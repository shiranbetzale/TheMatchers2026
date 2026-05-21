import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = {
  pinChildrenContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listCard: (color: string) => ({
    alignItems: 'center',
    gap: GeneralStyle.space,
    padding: GeneralStyle.space * 1.2,
    marginBottom: GeneralStyle.space,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderColor: color,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    ...Colors.Shadow,
  }),
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
    borderColor: Colors.border,
  },
  avatar: {
    width: '100%' as const,
    height: '100%' as const,
  },
  cardInfo: {
    flex: 1,
    gap: GeneralStyle.space / 2,
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
    gap: GeneralStyle.space / 2,
  },
  viewButton: {
    paddingVertical: GeneralStyle.space * 0.65,
    paddingHorizontal: GeneralStyle.space,
    backgroundColor: Colors.darkGreen,
  },
  editButton: {
    paddingVertical: GeneralStyle.space * 0.65,
    paddingHorizontal: GeneralStyle.space,
    backgroundColor: Colors.color1,
  },
  actionText: {
    ...FontsStyle.text,
    color: Colors.white,
    fontSize: 13,
  },
};
