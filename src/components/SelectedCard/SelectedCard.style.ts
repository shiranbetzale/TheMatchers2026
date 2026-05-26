import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import { FontsStyle } from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        opacity: 1
    },
    imgContainer: {
        borderColor: Colors.borderSoft,
        borderWidth: 2,
        width: 94,
        height: 94,
        borderRadius: 47,
        alignItems: "center",
        marginTop: GeneralStyle.spacing.sm,
        overflow: 'hidden',
    },
    infoContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: GeneralStyle.spacing.xs,
        paddingVertical: GeneralStyle.spacing.sm,
        paddingHorizontal: GeneralStyle.spacing.md,
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: Colors.borderSoft,
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderSoft,
        backgroundColor: Colors.champagne,
        shadowOpacity: 0,
        elevation: 0,
    },
    rtlRow: {
        flexDirection: "row-reverse",
    },
    ltrRow: {
        flexDirection: "row",
    },
    img: {
        width: "100%",
        height: "100%",
    },
    info: {
        alignItems: "center",
        flexWrap: 'wrap',
        marginBottom: 0,
    },
    detailsBlock: {
        flex: 1,
        minWidth: 0,
    },
    detailsBlockRtl: {
        alignItems: 'flex-end',
    },
    detailsBlockLtr: {
        alignItems: 'flex-start',
    },
    textRight: {
        textAlign: 'right',
    },
    textLeft: {
        textAlign: 'left',
    },
    boy: {
        backgroundColor: Colors.lightBlue
    },
    girl: {
        backgroundColor: Colors.pink
    },
    txt: {
        ...FontsStyle.menuTitle,
        color: Colors.darkGreen,
    },
    actions: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: GeneralStyle.spacing.xs,
        flexShrink: 0,
        paddingHorizontal: GeneralStyle.spacing.xs,
    },
    actionButton: {
        width: 40,
        height: 40,
        minHeight: 40,
        paddingHorizontal: 0,
        paddingVertical: 0,
        backgroundColor: Colors.surfaceElevated,
        borderColor: Colors.borderSoft,
        borderRadius: GeneralStyle.radius.sm,
        shadowOpacity: 0,
        elevation: 0,
    },
});
