import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row-reverse",
    },
    imgBtnContainer: {
        alignItems: "center",
        marginLeft: GeneralStyle.space * 2,
    },
    imgContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    img: {
        width: "100%",
        height: "100%",
    },
    info: {
        flexDirection: "row-reverse",
    },
    icon: {
        width: 40,
        height: 40,
        backgroundColor: Colors.transparent,
        justifyContent: "center",
    },
    infoButtons: {
        flexDirection: "row-reverse"
    }
});
