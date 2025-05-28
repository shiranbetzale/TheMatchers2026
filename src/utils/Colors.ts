import DeviceInfo from "react-native-device-info";

const shadowAndroid = {
    shadowColor: "rgba(17,43,85,0.25)",
    elevation: 15,
    backgroundColor: "#ffffff",
};

const shadowiOS = {
    shadowColor: "rgba(17,43,85,0.1)",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    backgroundColor: "#ffffff",
};

const oldShadow = {
    shadowColor: "#0E2B59",
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
    pink: "#e758b2",
    lightBlue: "#0b94be",
    lightBrown: "#c3b08c",
    white: '#fff',
    black: "#3a2915",
    border: "#d7c5a5",
    lightGreen: "#c0c161",
    green: "#98a653",
    btn: "#f2e8d3",
    darkGreen: "#656e25",
    brown: "#836c4c",
    transparent: "transparent",
    Shadow: shadowDeferrer(shadowiOS, shadowAndroid, oldShadow),
}

export default Colors;
