import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  alertBackground: {
    position: 'absolute',
    top: 120,
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,
    height: 200,
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center',
    opacity: 1,
    backgroundColor: 'white',
  },
  triangle: {
    position: 'absolute',
    top: 320,
    left: '50%',
    transform: [{ translateX: -10 }],
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  alertContainer: {
    position: 'absolute',
    top: 120,
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,
    height: 200,
    borderRadius: 40,
    padding: 10,
  },
  alertTitle: {
    paddingTop: 10,
    fontSize: 22,
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingTop: 20,
    paddingBottom: 20,
  },
  button: {
    width: 100,
    height: 100,
  },
  buttonIcon: {
    width: 100,
    height: 100,
  },
});

export default styles;
