import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 200,
  },
  alertContainer: {
    width: 300,
    height: 200,
    borderRadius: 40,
    padding: 10,
    flexDirection: 'column',
  },
  alertBackground: {
    position: 'absolute',
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
    top: 200,
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
  alertDescriptionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  alertDescription: {
    textAlign: 'center',
  },
});

export default styles;
