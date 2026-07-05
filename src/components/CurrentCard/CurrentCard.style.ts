import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import {
    CardSurfaceStyle,
    ProfileImageStyle,
} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        ...CardSurfaceStyle,
        ...Colors.Shadow,
    },
    imgContainer: {
        ...ProfileImageStyle,
        alignItems: "center",
        marginTop: GeneralStyle.spacing.xs,
        marginBottom: GeneralStyle.spacing.xs,
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
        fontSize: FontSize.title,
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
        minWidth: GeneralStyle.size.action,
    },
    icon: {
        width: GeneralStyle.size.iconLarge,
        height: GeneralStyle.size.iconLarge,
        minWidth: GeneralStyle.size.iconLarge,
        minHeight: GeneralStyle.size.iconLarge,
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
        fontSize: FontSize.micro,
        color: Colors.darkGreen,
        textAlign: "center",
    }
});
