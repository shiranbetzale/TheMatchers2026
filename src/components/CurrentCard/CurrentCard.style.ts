import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: GeneralStyle.spacing.sm,
        borderWidth: 1,
        borderColor: Colors.borderSoft,
        borderRadius: GeneralStyle.radius.md,
        backgroundColor: Colors.ivory,
        ...Colors.Shadow,
    },
    imgContainer: {
        borderColor: Colors.borderSoft,
        borderWidth: 2,
        width: 76,
        height: 76,
        borderRadius: 38,
        alignItems: "center",
        marginTop: GeneralStyle.spacing.xs,
        marginBottom: GeneralStyle.spacing.xs,
        overflow: 'hidden',
        backgroundColor: Colors.surface,
    },
    infoContainer: {
        width: "80%",
        alignItems: "center",
        marginVertical: GeneralStyle.spacing.sm,
        justifyContent: "space-between"
    },
    img: {
        width: "100%",
        height: "100%",
    },
    boy: {},
    girl: {},
    txt: {
        ...FontsStyle.menuTitle,
        fontSize: 20,
        color: Colors.darkGreen,
        textAlign: 'center',
    },
    infoButtons: {
        width: "100%",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: GeneralStyle.spacing.sm,
        marginTop: GeneralStyle.spacing.sm,
        paddingTop: GeneralStyle.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.line,
    },
    actionItem: {
        alignItems: "center",
        justifyContent: "center",
        minWidth: 52,
    },
    icon: {
        width: 40,
        height: 40,
        minWidth: 40,
        minHeight: 40,
        backgroundColor: Colors.ivory,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.borderSoft,
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    actionLabel: {
        marginTop: 3,
        fontSize: 10,
        color: Colors.darkGreen,
        textAlign: "center",
    }
});
