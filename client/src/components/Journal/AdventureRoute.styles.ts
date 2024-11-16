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
    transform: [{ translateX: -180 }, { translateY: -220 }],
    width: 360,
    height: 440,
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
  emptyGpsLogContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
  },
  emptyGpsLogText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default styles;
