import DeviceInfo from "react-native-device-info";

const shadowAndroid = {
    shadowColor: "rgba(15,46,99,0.25)",
    elevation: 15,
    backgroundColor: "#ffffff",
};

const shadowiOS = {
    shadowColor: "rgba(15,46,99,0.12)",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    backgroundColor: "#ffffff",
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
    pink: "#f1a8b3",
    lightBlue: "#9bd1e9",
    color1: "#C5A15E", // gold accent
    appBg: "#F7F4EF", // calm background
    surface: "#FFFFFF",
    border: "#E4DCCF",
    white: '#fff',
    black: "#1f1f1f",
    darkGreen: "#0F2E63", // deep blue accent
    transparent: "transparent",
    Shadow: shadowDeferrer(shadowiOS, shadowAndroid, oldShadow),
}

export default Colors;
