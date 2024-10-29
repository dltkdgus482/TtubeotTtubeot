import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 261,
    width: '100%',
  },
  alertBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    opacity: 1,
  },
  alertContainer: {
    paddingHorizontal: 40,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  alertSection: {
    height: '33%',
    justifyContent: 'center',
  },
  alertTitle: {
    paddingTop: 10,
    fontSize: 25,
    textAlign: 'center',
  },
  alertContent: {
    fontSize: 20,
    color: '#7A7A7A',
    textDecorationLine: 'underline',
    textDecorationColor: '#7A7A7A',
  },
});

export default styles;
