import { StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontSize, FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';
import {CardBorderStyle} from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
    headerStyle: {
        height: GeneralStyle.size.avatar,
        backgroundColor: Colors.darkGreen,
    },
    drawerStyle: {
        width: '82%',
        backgroundColor: Colors.ivory,
        borderTopLeftRadius: GeneralStyle.radius.lg,
        borderBottomLeftRadius: GeneralStyle.radius.lg,
    },
    drawerContent: {
        flexGrow: 1,
        paddingTop: GeneralStyle.spacing.lg,
        paddingHorizontal: GeneralStyle.spacing.md,
        paddingBottom: GeneralStyle.spacing.xl,
        backgroundColor: Colors.ivory,
    },
    drawerHeader: {
        alignItems: 'center',
        paddingTop: GeneralStyle.spacing.md,
        paddingBottom: GeneralStyle.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.line,
    },
    drawerLogo: {
        width: GeneralStyle.size.badge,
        height: GeneralStyle.size.badge,
        borderRadius: 31,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.goldWash,
        borderWidth: 1,
        borderColor: Colors.color1Light,
        marginBottom: GeneralStyle.spacing.sm,
    },
    drawerLogoText: {
        ...FontsStyle.textDecoration,
        color: Colors.goldDark,
        fontSize: FontSize.large,
    },
    drawerBrand: {
        ...FontsStyle.menuTitle,
        color: Colors.darkGreen,
        fontSize: FontSize.section,
        textAlign: 'center',
    },
    drawerSubtitle: {
        ...FontsStyle.text,
        color: Colors.slate,
        fontSize: FontSize.caption,
        marginTop: 2,
        textAlign: 'center',
    },
    drawerProfileCard: {
        ...CardBorderStyle,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: GeneralStyle.spacing.sm,
        paddingHorizontal: GeneralStyle.spacing.md,
        paddingVertical: GeneralStyle.spacing.md,
        marginTop: GeneralStyle.spacing.md,
        marginBottom: GeneralStyle.spacing.md,
        backgroundColor: Colors.white,
    },
    profileAvatar: {
        width: GeneralStyle.size.control,
        height: GeneralStyle.size.control,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.navyDeep,
        borderWidth: 1,
        borderColor: Colors.premiumLine,
    },
    profileAvatarText: {
        ...FontsStyle.textDecoration,
        color: Colors.white,
        fontSize: FontSize.large,
    },
    profileTextBlock: {
        flex: 1,
        alignItems: 'flex-end',
    },
    profileName: {
        ...FontsStyle.textDecoration,
        color: Colors.darkGreen,
        fontSize: FontSize.body,
    },
    profileRole: {
        ...FontsStyle.text,
        color: Colors.slate,
        fontSize: FontSize.caption,
    },
    drawerSection: {
        gap: GeneralStyle.spacing.xs,
    },
    drawerItem: {
        minHeight: GeneralStyle.size.largeControl,
        alignItems: 'center',
        gap: GeneralStyle.spacing.sm,
        paddingHorizontal: GeneralStyle.spacing.sm,
        borderRadius: GeneralStyle.radius.md,
        borderWidth: 1,
        borderColor: Colors.transparent,
    },
    drawerItemRtl: {
        flexDirection: 'row-reverse',
    },
    drawerItemLtr: {
        flexDirection: 'row',
    },
    drawerItemActive: {
        backgroundColor: Colors.softBlue,
        borderColor: Colors.borderSoft,
    },
    drawerItemIcon: {
        width: GeneralStyle.size.icon,
        height: GeneralStyle.size.icon,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderSoft,
    },
    drawerItemIconActive: {
        backgroundColor: Colors.goldWash,
        borderColor: Colors.premiumLine,
    },
    drawerItemText: {
        ...FontsStyle.textDecoration,
        flex: 1,
        color: Colors.slate,
        fontSize: FontSize.body,
    },
    drawerItemTextActive: {
        color: Colors.darkGreen,
    },
    drawerTextRight: {
        textAlign: 'right',
    },
    drawerTextLeft: {
        textAlign: 'left',
    },
    logoutButton: {
        minHeight: GeneralStyle.size.largeControl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: GeneralStyle.spacing.sm,
        paddingHorizontal: GeneralStyle.spacing.sm,
        marginTop: GeneralStyle.spacing.lg,
        borderRadius: GeneralStyle.radius.md,
        borderWidth: 1,
        borderColor: Colors.danger,
        backgroundColor: Colors.dangerSoft,
    },
    logoutButtonRtl: {
        flexDirection: 'row-reverse',
    },
    logoutButtonLtr: {
        flexDirection: 'row',
    },
    logoutIcon: {
        width: GeneralStyle.size.icon,
        height: GeneralStyle.size.icon,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dangerSoft,
        borderWidth: 1,
        borderColor: Colors.danger,
    },
    logoutText: {
        ...FontsStyle.textDecoration,
        color: Colors.danger,
        fontSize: FontSize.body,
        textAlign: 'center',
    },
});
