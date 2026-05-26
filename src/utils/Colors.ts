import DeviceInfo from "react-native-device-info";

const shadowAndroid = {
    shadowColor: "rgba(8, 24, 52, 0.16)",
    elevation: 7,
    backgroundColor: "#FFFCF7",
};

const shadowiOS = {
    shadowColor: "rgba(8, 24, 52, 0.12)",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 14,
    backgroundColor: "#FFFCF7",
};

const oldShadow = {
    shadowColor: "#0F2E63",
    elevation: 4,
    backgroundColor: "#ffffff",
};

const shadowDeferrer = (iOS: any, newAndroid: any, oldAndroid: any) => {
    const os = DeviceInfo.getSystemName();
    const version = DeviceInfo.getSystemVersion();
    if (os === "iOS" || os === "iPhone OS") return iOS;
    if (Number(version) >= 9) return newAndroid;
    return oldAndroid;
};

const Colors = {
    pink: "#F2DCE2",
    lightBlue: "#DDEAF7",
    color1: "#B98A2D",
    goldDark: "#8A641F",
    goldSoft: "#F3E7CE",
    goldWash: "#FFF8EA",
    color1Light: "#E3D0AA",
    appBg: "#F8F4EC",
    appBgDeep: "#EFE7D8",
    surface: "#FFFCF7",
    surfaceMuted: "#F3EEE5",
    surfaceElevated: "#FFFFFF",
    champagne: "#FBF4E6",
    ivory: "#FFFCF7",
    border: "#D8C59F",
    borderSoft: "#E7DBC5",
    white: '#fff',
    black: "#172033",
    darkGreen: "#08244A",
    navySoft: "#123965",
    navyDeep: "#061A36",
    emerald: "#08244A",
    emeraldSoft: "#EAF2FA",
    roseSoft: "#F7E9E4",
    slate: "#4B5565",
    softBlue: "#EDF4FA",
    navyTint: "#F4F8FC",
    premiumLine: "#C59B45",
    inkMuted: "#6B7280",
    line: "#EFE6D6",
    successSoft: "#ECF7F2",
    dangerSoft: "#FFF2EF",
    danger: "#B84A42",
    overlay: "rgba(8, 24, 52, 0.42)",
    transparent: "transparent",
    Shadow: shadowDeferrer(shadowiOS, shadowAndroid, oldShadow),
}

export default Colors;
