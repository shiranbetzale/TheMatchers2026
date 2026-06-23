import {Dimensions, StyleSheet} from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';
import Colors from '../../utils/Colors';

const {width, height} = Dimensions.get('window');

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
    paddingBottom: GeneralStyle.spacing.sm * 2,
  },
  svContainer: {
    width: '100%',
    padding: GeneralStyle.spacing.sm,
  },
  pinChildren: {
    width: '100%',
    zIndex: 10,
    backgroundColor: Colors.ivory,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    minHeight: 0,
    zIndex: 1,
  },
  bgContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    overflow: 'hidden',
    backgroundColor: Colors.appBg,
  },
  bgShapeOne: {
    position: 'absolute',
    width: '100%',
    height: 128,
    backgroundColor: Colors.ivory,
    top: 0,
    left: 0,
    zIndex: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    opacity: 0.55,
  },
  bgShapeTwo: {
    position: 'absolute',
    width: width * 1.35,
    height: 76,
    backgroundColor: Colors.goldWash,
    top: 94,
    right: -width * 0.18,
    zIndex: 0,
    opacity: 0.9,
    transform: [{rotate: '-9deg'}],
  },
  bgShapeThree: {
    position: 'absolute',
    width: width * 0.82,
    height: height * 0.72,
    backgroundColor: Colors.navyTint,
    top: 178,
    right: -width * 0.34,
    zIndex: 0,
    opacity: 0.28,
    borderLeftWidth: 1,
    borderColor: Colors.borderSoft,
    transform: [{rotate: '7deg'}],
  },
  bgShapeFour: {
    position: 'absolute',
    width: width * 0.94,
    height: 1,
    // backgroundColor: Colors.premiumLine,
    top: 176,
    alignSelf: 'center',
    opacity: 0.36,
  },
  bgShapeFive: {
    position: 'absolute',
    width: width * 1.2,
    height: 54,
    backgroundColor: Colors.surfaceElevated,
    top: height * 0.58,
    left: -width * 0.12,
    opacity: 0.58,
    transform: [{rotate: '-6deg'}],
  },
  bgShapeSix: {
    position: 'absolute',
    width: width * 0.72,
    height: height * 0.46,
    borderWidth: 1,
    borderColor: Colors.line,
    top: height * 0.3,
    left: -width * 0.38,
    opacity: 0.8,
    transform: [{rotate: '10deg'}],
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingBottom: GeneralStyle.spacing.xl * 3,
  },
  staticContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  staticContent: {
    flex: 1,
    paddingTop: GeneralStyle.spacing.md,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingBottom: GeneralStyle.spacing.xl * 2,
  },

});
