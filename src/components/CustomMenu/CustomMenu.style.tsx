import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row-reverse",
        backgroundColor: Colors.color1,
        alignItems: "center",
        alignContent: "center",
        paddingTop: GeneralStyle.space * 2,
        justifyContent: "space-between"
    },
    menuTxtContainer: {
        flexDirection: "row-reverse",
        alignItems: "center",
        alignContent: "center",
    },
    space: {
        marginLeft: GeneralStyle.space
    }
});
