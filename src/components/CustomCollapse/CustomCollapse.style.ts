import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    whiteCardContainer: {
        marginBottom: GeneralStyle.space,
    },
    collapseBtn: {
        alignItems: "flex-end",
        marginBottom: GeneralStyle.space * 2,
        opacity: 0.98,
        borderColor: Colors.black,
        borderWidth: 2,
    }
});
