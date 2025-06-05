import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row-reverse',
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
  },
  dot: {
    color: '#888',
    fontSize: 40,
  },
  activeDot: {
    color: '#FFF',
    fontSize: 40,
  },
  img: {
    width: "100%",
    height: "100%",
  }
});
