import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        padding: GeneralStyle.space,
        height: Dimensions.get("screen").height - 120,
    },
    filterFieldContainer: {
        width: "100%",
        flexDirection: "row-reverse",
    },
    filterField: {
        width: "50%",
        padding: GeneralStyle.space,
        flexDirection: "row-reverse",
    },
});
