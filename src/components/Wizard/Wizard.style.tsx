import { Dimensions, StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  wizardContainer: {
    borderBottomWidth: 2,
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: GeneralStyle.space,
    backgroundColor: Colors.darkGreen,
  },
  containerDynamicComp: {
    margin: GeneralStyle.space,
    height: Dimensions.get("window").height - 200,
  },
});
