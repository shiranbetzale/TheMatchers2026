import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        opacity: 0.9
    },
    imgContainer: {
        borderColor: Colors.black,
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        marginTop: GeneralStyle.space,
        overflow: 'hidden',
    },
    infoContainer: {
        width: "80%",
        alignItems: "center",
        marginVertical: GeneralStyle.space,
    },
    img: {
        width: "100%",
        height: "100%",
    },
    info: {
        flexDirection: "row-reverse",
    },
    boy: {
        backgroundColor: Colors.lightBlue
    },
    girl: {
        backgroundColor: Colors.pink
    },
});
