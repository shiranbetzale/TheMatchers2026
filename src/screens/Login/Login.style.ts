import { StyleSheet } from 'react-native';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  alignItems: 'stretch',
   // justifyContent: 'center',
   // position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  langSwitchContainer: {
    alignItems: 'center',
   // paddingHorizontal: GeneralStyle.space,
    paddingVertical: GeneralStyle.space,
    zIndex: 2,
  },
  langSwitchButton: {
    paddingHorizontal: GeneralStyle.space * 1.4,
    paddingVertical: GeneralStyle.space * 0.8,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    ...Colors.Shadow,
    // alignContent: "center",
  },
  langRow: {
    alignItems: 'center',
    gap: GeneralStyle.space / 2,
  },
  langSwitchText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  errorContainer: {
    marginHorizontal: GeneralStyle.space,
    marginTop: GeneralStyle.space,
  },
  errorContainerBottom: {
    marginHorizontal: GeneralStyle.space,
    marginTop: GeneralStyle.space,
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    padding: GeneralStyle.space * 2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 3,
    borderTopColor: Colors.color1,
  },
  modalTitle: {
    ...FontsStyle.title,
    marginBottom: GeneralStyle.space,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: GeneralStyle.space,
  },
  modalOptionText: {
    ...FontsStyle.text,
    textAlign: 'center',
  },
  title: {
    //paddingTop: GeneralStyle.space * 2,
    ...FontsStyle.title,
//    alignItems: "center"
    marginBottom: GeneralStyle.space * 2,
    color: Colors.darkGreen,
    zIndex: 2,
  },
  whiteCardContainer: {
    ///  verticalAlign: 'center',
   // marginVertical: GeneralStyle.space,
    alignSelf: 'center',
    maxWidth: 560,
  },
  formContent: {
    width: '100%',
  },
  space: {
    marginVertical: GeneralStyle.space,
  },
});
