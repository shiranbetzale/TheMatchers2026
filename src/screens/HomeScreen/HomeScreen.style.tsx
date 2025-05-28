import { Dimensions, StyleSheet } from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        alignItems: "center",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },
    svContainer: {
        width: "100%",
        padding: GeneralStyle.space
    },
    pinChildren: {
        width: "100%",
    }
});
