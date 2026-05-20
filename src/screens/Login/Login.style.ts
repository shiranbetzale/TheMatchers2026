import { StyleSheet } from 'react-native';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  alignItems: 'stretch',
   // justifyContent: 'center',
   // position: 'relative',
  },
  ltr: {
    direction: 'ltr',
  },
  rtl: {
    direction: 'rtl',
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
  },
  langSwitchButton: {
    padding: GeneralStyle.space,
    borderWidth: 1,
    borderRadius: 20,
    // alignContent: "center",
  },
  langRow: {
    alignItems: 'center',
    gap: GeneralStyle.space / 2,
  },
  langSwitchText: {
    ...FontsStyle.text,
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
    backgroundColor: '#fff',
    padding: GeneralStyle.space * 2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  },
  whiteCardContainer: {
    ///  verticalAlign: 'center',
   // marginVertical: GeneralStyle.space,
    //width: '90%',
    //alignSelf: 'center',
  },
  formContent: {
   // width: '100%',
  },
  space: {
    marginVertical: GeneralStyle.space,
  },
});
