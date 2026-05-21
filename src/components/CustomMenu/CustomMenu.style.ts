import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.darkGreen,
        alignItems: "center",
        alignContent: "center",
        paddingTop: GeneralStyle.space * 2,
        paddingBottom: GeneralStyle.space,
        paddingHorizontal: GeneralStyle.space,
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomColor: Colors.color1,
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
