import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  smallRange: {
    marginRight: GeneralStyle.space,
    marginBottom: GeneralStyle.space / 2
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
  smallRangeText: {
    position: "absolute",
    bottom: -8,
  },
  left: {
    left: - GeneralStyle.space,
  },
  right: {
    right: 0
  },
  markerStyle: {
    backgroundColor: Colors.color1,
  },
  pressedMarkerStyle: {
    backgroundColor: Colors.color1
  },
  selectedStyle: {
    backgroundColor: Colors.black
  }
});
