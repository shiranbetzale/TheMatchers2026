import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row-reverse",
        backgroundColor: Colors.lightBrown,
        alignItems: "center",
        alignContent: "center",
        padding: GeneralStyle.space,
        paddingTop: GeneralStyle.space * 2,
    },
    menuBtn: {
        width: 35,
        height: 35,
        backgroundColor: Colors.transparent,
        borderWidth: 2,
        justifyContent: "center",
    }
});
