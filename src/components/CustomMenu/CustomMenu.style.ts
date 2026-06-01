import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.ivory,
        alignItems: "center",
        alignContent: "center",
        position: "relative",
        paddingTop: GeneralStyle.spacing.lg,
        paddingBottom: GeneralStyle.spacing.md,
        paddingHorizontal: GeneralStyle.spacing.md,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderSoft,
        ...Colors.Shadow,
    },
    topAccent: {
        position: "absolute",
        top: 0,
        left: GeneralStyle.spacing.md,
        right: GeneralStyle.spacing.md,
        height: 3,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: Colors.premiumLine,
        opacity: 0.72,
    },
    menuTxtContainer: {
        alignItems: "center",
        alignContent: "center",
        gap: GeneralStyle.spacing.sm,
    },
    sideSlot: {
        width: 54,
        alignItems: "center",
        justifyContent: "center",
    },
    menuTitleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: GeneralStyle.spacing.sm,
        minWidth: 0,
    },
    brandGroup: {
        alignItems: "center",
        gap: 10,
        flexShrink: 1,
    },
    brandLogo: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surface,
    },
    brandLogoText: {
        ...FontsStyle.subTitle,
        color: Colors.goldDark,
        fontSize: 16,
    },
    row: {
        flexDirection: "row",
    },
    rowReverse: {
        flexDirection: "row-reverse",
    },
    space: {
        marginLeft: GeneralStyle.spacing.sm
    },
    iconButton: {
        backgroundColor: Colors.ivory,
        borderColor: Colors.borderSoft,
        shadowOpacity: 0,
        elevation: 0,
    },
    title: {
        ...FontsStyle.menuTitle,
        color: Colors.darkGreen,
        fontSize: 30,
        textAlign: "center",
        flexShrink: 1,
    },
});
