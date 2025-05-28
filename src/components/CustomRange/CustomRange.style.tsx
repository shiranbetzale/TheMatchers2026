import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    width: "100%",
    marginTop: GeneralStyle.space
  },
  range: {
    alignItems: 'center',
    width: "70%",
  },
  rangeText: {
    width: "15%",
  },
  markerStyle: {
    backgroundColor: Colors.border,
  },
  pressedMarkerStyle: {
    backgroundColor: Colors.btn
  },
  selectedStyle: {
    backgroundColor: Colors.black
  }
});
