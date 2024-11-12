import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -200 }, { translateY: -250 }],
    width: 400,
    height: 500,
    borderRadius: 32,
    padding: 7,
    backgroundColor: '#C7E5C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default styles;
