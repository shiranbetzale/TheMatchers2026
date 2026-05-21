import { Dimensions, StyleSheet } from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: Colors.appBg,
    overflow: 'hidden',
  }, 
  image: {
    alignItems: 'center',
    height: Dimensions.get('screen').height - 75,
    width: Dimensions.get('window').width,
    paddingBottom: GeneralStyle.space * 2,
  },
  svContainer: {
    width: '100%',
    padding: GeneralStyle.space,
  },
  pinChildren: {
    width: '100%',
  },

  bgContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  bgShapeOne: {
    position: 'absolute',
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: width,
    backgroundColor: '#071E3D12',
    top: -width * 0.58,
    left: -width * 0.28,
    zIndex: 0,
  },
  bgShapeTwo: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width,
    backgroundColor: Colors.softBlue,
    bottom: -width * 0.5,
    right: -width * 0.2,
    zIndex: 0,
  },
  bgShapeThree: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    borderWidth: 1,
    borderColor: '#B88A3555',
    top: width * 0.15,
    right: -width * 0.3,
    zIndex: 0,
  },
  // pinChildren: {
  //   position: 'absolute',
  //   width: '100%',
  //   zIndex: 10,
  //   top: 0,
  // },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

});
