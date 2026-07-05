import DeviceInfo from 'react-native-device-info';

const shadowAndroid = {
  shadowColor: 'rgba(8, 24, 52, 0.16)',
  elevation: 7,
};

const shadowiOS = {
  shadowColor: 'rgba(8, 24, 52, 0.12)',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 1,
  shadowRadius: 14,
};

const oldShadow = {
  shadowColor: '#0F2E63',
  elevation: 4,
};

const shadowDeferrer = (iOS: any, newAndroid: any, oldAndroid: any) => {
  const os = DeviceInfo.getSystemName();
  const version = DeviceInfo.getSystemVersion();
  if (os === 'iOS' || os === 'iPhone OS') return iOS;
  if (Number(version) >= 9) return newAndroid;
  return oldAndroid;
};

const Colors = {
  color1: '#B98A2D',
  goldDark: '#8A641F',
  goldSoft: '#F3E7CE',
  goldWash: '#FFF8EA',
  color1Light: '#E3D0AA',
  appBg: '#F8F4EC',
  surfaceMuted: '#F3EEE5',
  champagne: '#FBF4E6',
  ivory: '#FFFCF7',
  border: '#D8C59F',
  borderSoft: '#E7DBC5',
  white: '#fff',
  black: '#172033',
  darkGreen: '#08244A',
  navyDeep: '#061A36',
  roseSoft: '#F7E9E4',
  slate: '#4B5565',
  softBlue: '#EDF4FA',
  premiumLine: '#C59B45',
  inkMuted: '#6B7280',
  placeholder: '#A8ADB7',
  line: '#EFE6D6',
  controlDisabled: '#C8D0DC',
  successSoft: '#ECF7F2',
  success: '#1F8A5B',
  dangerSoft: '#FFF2EF',
  danger: '#B84A42',
  info: '#2F68B8',
  overlay: 'rgba(8, 24, 52, 0.42)',
  overlaySoft: 'rgba(8, 24, 52, 0.28)',
  overlayDark: 'rgba(0, 0, 0, 0.55)',
  overlayImage: 'rgba(0, 0, 0, 0.9)',
  transparent: 'transparent',
  Shadow: shadowDeferrer(shadowiOS, shadowAndroid, oldShadow),
};

export default Colors;
