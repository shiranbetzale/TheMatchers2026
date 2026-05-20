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
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    backgroundColor: '#C5A15E33', // gold tint
    top: -width * 0.7,
    left: -width * 0.3,
    zIndex: 0,
  },
  bgShapeTwo: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width,
    backgroundColor: '#6FA6FF33', // lighter blue tint
    bottom: -width * 0.5,
    right: -width * 0.2,
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
  },
  scrollContent: {
    paddingTop: 80, // רווח כדי שהתוכן לא יתנגש עם pinChildren
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

});
