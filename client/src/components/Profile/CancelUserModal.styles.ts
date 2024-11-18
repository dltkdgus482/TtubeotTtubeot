import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    height: '70%',
    padding: 40,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 40,
    height: 240,
    paddingTop: 30,
    paddingHorizontal: 22,
  },
  modalTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    flexDirection: 'row',
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: '#E9E9E9',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 18,
  },
  confirmButton: {
    backgroundColor: '#3E4A3D',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 18,
  },
});

export default styles;
