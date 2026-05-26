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
    marginRight: GeneralStyle.spacing.sm,
    marginBottom: GeneralStyle.spacing.sm / 2
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    width: "100%",
    marginTop: GeneralStyle.spacing.sm
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
    left: - GeneralStyle.spacing.sm,
  },
  right: {
    right: 0
  },
  markerStyle: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.color1,
  },
  pressedMarkerStyle: {
    backgroundColor: Colors.goldSoft,
    borderColor: Colors.goldDark,
  },
  selectedStyle: {
    backgroundColor: Colors.darkGreen
  }
});
