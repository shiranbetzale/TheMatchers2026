import { StyleSheet } from "react-native";
import Colors from "./Colors";

const fontFamily = {
    medium: "IBMPlexSansHebrew-Medium",
    semiBold: "IBMPlexSansHebrew-SemiBold",
    bold: "IBMPlexSansHebrew-Medium",
    regular: "IBMPlexSansHebrew-Regular",
    light: "IBMPlexSansHebrew-Light",
};

export const FontsStyle = StyleSheet.create({
    baseFont: {
        color: Colors.black,
        textAlign: "right",
        fontSize: 16,
    },
    title: {
        fontFamily: fontFamily.semiBold,
        color: Colors.darkGreen,
        fontSize: 40,
    },
    menuTitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: 26,
    },
    wizardTitle: {
        fontFamily: fontFamily.medium,
        color: Colors.color1,
        fontSize: 24,
    },
    textDecoration: {
        fontFamily: fontFamily.semiBold,
        textDecorationLine: "underline",
    },
    subTitle: {
        fontFamily: fontFamily.medium,
    },
    text: {
        fontFamily: fontFamily.regular,
    },
    textRight: {
        textAlign: "right",
    },
    textCenter: {
        textAlign: "center",
    },
    textLeft: {
        textAlign: "left",
    }
});
