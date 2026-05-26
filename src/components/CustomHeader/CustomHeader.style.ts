import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.ivory,
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        gap: GeneralStyle.spacing.sm,
        paddingHorizontal: GeneralStyle.spacing.md,
        paddingVertical: GeneralStyle.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderSoft,
        ...Colors.Shadow,
    },
    actions: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: GeneralStyle.spacing.sm,
        width: 112,
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
    },
    title: {
        ...FontsStyle.menuTitle,
        color: Colors.darkGreen,
        fontSize: 24,
        textAlign: "center",
    },
    sidePlaceholder: {
        width: 112,
    },
    iconButton: {
        backgroundColor: Colors.ivory,
        borderColor: Colors.borderSoft,
    },
});
