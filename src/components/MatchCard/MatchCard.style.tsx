import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row-reverse",
        alignItems: "center",
        marginBottom: GeneralStyle.space,
        alignContent: "space-between",
    },
    imgContainer: {
        borderColor: Colors.black,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginLeft: GeneralStyle.space,
    },
    img: {
        width: "100%",
        height: "100%",
    },
    info: {
        flexDirection: "row-reverse",
    },
});
