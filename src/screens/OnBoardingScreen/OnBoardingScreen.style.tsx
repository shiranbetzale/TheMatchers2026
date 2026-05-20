import {StyleSheet, Dimensions} from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  bgShapeOne: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    backgroundColor: '#C5A15E33',
    top: -width * 0.7,
    left: -width * 0.3,
  },
  bgShapeTwo: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width,
    backgroundColor: '#0F2E6333',
    bottom: -width * 0.5,
    right: -width * 0.2,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: GeneralStyle.space * 2,
  },
  slideCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: GeneralStyle.space * 2,
    ...Colors.Shadow,
    alignItems: 'center',
  },
  image: {
    width: width * 0.82,
    height: height * 0.45,
    borderRadius: 20,
    marginBottom: GeneralStyle.space * 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: GeneralStyle.space,
    marginBottom: GeneralStyle.space * 2.5,
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DCCEB0',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.color1,
    width: 12,
    height: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: GeneralStyle.space * 2,
    paddingVertical: GeneralStyle.space * 1.2,
    marginHorizontal: GeneralStyle.space * 1.5,
    marginBottom: GeneralStyle.space * 2.5,
    backgroundColor: Colors.white,
    borderRadius: 18,
    ...Colors.Shadow,
    gap: GeneralStyle.space,
  },
  skipText: {
    fontSize: 16,
    color: Colors.darkGreen,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  prevButton: {
    backgroundColor: '#E8F0FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.darkGreen,
  },
  prevButtonText: {
    color: Colors.darkGreen,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: Colors.darkGreen,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
