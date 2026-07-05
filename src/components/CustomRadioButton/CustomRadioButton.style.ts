import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import GeneralStyle from "../../utils/GeneralStyle";
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  smallBtn: {
    marginTop: GeneralStyle.spacing.sm / 2
  },
  btn: {
    marginTop: GeneralStyle.spacing.sm
  },
  optionsContainer: {
    alignContent: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  smallCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: GeneralStyle.spacing.sm / 2,
  },
  baseCircle: {
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    borderWidth: 2,
  },
  circle: {
    width: GeneralStyle.size.controlSm,
    height: GeneralStyle.size.controlSm,
    borderRadius: 15,
    marginLeft: GeneralStyle.spacing.sm,
  },
  selectedCircle: {
    backgroundColor: Colors.color1,
  },
  textRight: {
    ...SharedStyles.textRight,
    width: '100%',
  },
  textLeft: {
    ...SharedStyles.textLeft,
    width: '100%',
  },
});
