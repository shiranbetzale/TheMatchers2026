import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rtlRow: {
        flexDirection: "row-reverse",
    },
    ltrRow: {
        flexDirection: "row",
    },
    imgBtnContainer: {
        alignItems: "center",
    },
    imgBtnContainerRtl: {
        marginLeft: GeneralStyle.space * 2,
    },
    imgBtnContainerLtr: {
        marginRight: GeneralStyle.space * 2,
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
        alignItems: "center",
    },
    icon: {
        width: 40,
        height: 40,
        backgroundColor: Colors.transparent,
        justifyContent: "center",
    },
    infoButtons: {
        alignItems: "center",
    }
});
