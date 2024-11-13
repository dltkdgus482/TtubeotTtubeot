import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    zIndex: 999,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  closeButton: {
    fontSize: 24,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
