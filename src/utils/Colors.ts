import DeviceInfo from "react-native-device-info";

const shadowAndroid = {
    shadowColor: "rgba(8,22,48,0.28)",
    elevation: 12,
    backgroundColor: "#FEFCF8",
};

const shadowiOS = {
    shadowColor: "rgba(8,22,48,0.16)",
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
    backgroundColor: "#FEFCF8",
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
    pink: "#F5D7DC",
    lightBlue: "#D9E7F7",
    color1: "#B88A35",
    color1Light: "#E9D7B5",
    appBg: "#F8F6F1",
    surface: "#FEFCF8",
    surfaceMuted: "#F1ECE3",
    border: "#D9C8AA",
    white: '#fff',
    black: "#151923",
    darkGreen: "#071E3D",
    slate: "#334155",
    softBlue: "#EAF1FB",
    transparent: "transparent",
    Shadow: shadowDeferrer(shadowiOS, shadowAndroid, oldShadow),
}

export default Colors;
