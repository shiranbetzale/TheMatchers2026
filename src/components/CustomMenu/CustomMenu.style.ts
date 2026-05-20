import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.color1,
        alignItems: "center",
        alignContent: "center",
        paddingTop: GeneralStyle.space * 2,
        justifyContent: "space-between"
    },
    menuTxtContainer: {
        alignItems: "center",
        alignContent: "center",
    },
    row: {
        flexDirection: "row",
    },
    rowReverse: {
        flexDirection: "row-reverse",
    },
    space: {
        marginLeft: GeneralStyle.space
    }
});
