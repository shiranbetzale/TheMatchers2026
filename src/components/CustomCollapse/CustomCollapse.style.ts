import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: GeneralStyle.spacing.sm,
        backgroundColor: 'transparent',
        overflow: 'visible',
    },
    contentContainer: {
        paddingTop: GeneralStyle.spacing.md,
        paddingBottom: GeneralStyle.spacing.xl,
        overflow: 'visible',
    },
    whiteCardContainer: {
        marginBottom: GeneralStyle.spacing.md,
        paddingHorizontal: GeneralStyle.spacing.md,
        paddingVertical: GeneralStyle.spacing.md,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: Colors.borderSoft,
        borderLeftColor: Colors.borderSoft,
        borderTopColor: Colors.borderSoft,
        borderBottomWidth: 2,
        borderBottomColor: Colors.color1Light,
        backgroundColor: Colors.surfaceElevated,
        overflow: 'visible',
        zIndex: 1,
    },
    autocompleteCard: {
        zIndex: 50,
        elevation: 12,
    },
    collapseBtn: {
        alignItems: "flex-end",
        marginBottom: GeneralStyle.spacing.sm,
        opacity: 0.98,
        borderColor: Colors.borderSoft,
        borderWidth: 1,
        borderTopWidth: 2,
        borderTopColor: Colors.premiumLine,
        backgroundColor: Colors.ivory,
        borderRadius: GeneralStyle.radius.md,
        paddingVertical: GeneralStyle.spacing.md,
        paddingHorizontal: GeneralStyle.spacing.md,
    },
    lockedCollapseBtn: {
        opacity: 0.35,
    },
    collapseTitle: {
        ...FontsStyle.subTitle,
        color: Colors.darkGreen,
        fontSize: 18,
        textAlign: 'right',
    },
});
