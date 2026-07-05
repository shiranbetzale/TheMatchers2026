import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
    minHeight: GeneralStyle.size.avatarSmall,
    alignItems: 'stretch',
    justifyContent: "center",
  },
  smallContainer: {
    minHeight: GeneralStyle.size.label,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
    marginBottom: GeneralStyle.spacing.xs,
  },
  smallRange: {
    width: '100%',
    marginBottom: GeneralStyle.spacing.xs,
    alignItems: 'center',
  },
  rangeContainer: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "center",
    width: "100%",
    marginTop: GeneralStyle.spacing.sm,
    paddingHorizontal: GeneralStyle.spacing.sm,
    rowGap: GeneralStyle.spacing.sm,
  },
  range: {
    width: '100%',
    alignItems: 'center',
  },
  rangeText: {
    width: GeneralStyle.size.media,
    alignItems: 'center',
  },
  smallRangeText: {
    width: GeneralStyle.size.label,
    alignItems: 'center',
  },
  stepperRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GeneralStyle.spacing.xs,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0
  },
  markerStyle: {
    backgroundColor: Colors.white,
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
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  stepButton: {
    width: GeneralStyle.size.controlSm,
    height: GeneralStyle.size.controlSm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.ivory,
    ...Colors.Shadow,
    elevation: 2,
  },
  stepButtonDisabled: {
    opacity: 0.35,
  },
  stepButtonText: {
    ...FontsStyle.subTitle,
    color: Colors.darkGreen,
    fontSize: FontSize.large,
    lineHeight: 20,
    textAlign: 'center',
  },
  stepValue: {
    ...FontsStyle.text,
    minWidth: GeneralStyle.size.icon,
    height: GeneralStyle.size.icon,
    paddingHorizontal: 2,
    paddingVertical: 0,
    textAlign: 'center',
    color: Colors.darkGreen,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
});
