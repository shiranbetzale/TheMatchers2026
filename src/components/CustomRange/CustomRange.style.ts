import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontsStyle} from '../../utils/FontsStyle';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 76,
    alignItems: 'stretch',
    justifyContent: "center",
  },
  smallContainer: {
    minHeight: 76,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
    marginBottom: GeneralStyle.spacing.xs,
  },
  smallRange: {
    marginRight: GeneralStyle.spacing.sm,
    marginBottom: GeneralStyle.spacing.sm / 2,
    alignItems: 'center',
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
    width: '15%',
  },
  left: {
    left: 0,
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
  },
  textRight: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  textLeft: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
