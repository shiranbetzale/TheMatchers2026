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
    boy: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.darkGreen,
    },
    girl: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.color1,
    },
    txt: {
        ...FontsStyle.menuTitle,
        fontSize: 20,
        color: Colors.darkGreen,
        textAlign: 'center',
    }
});
