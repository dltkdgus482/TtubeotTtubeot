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
    transform: [{ translateX: -150 }, { translateY: -100 }],
    height: 200,
    width: 300,
    borderRadius: 32,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalContent: {
    fontSize: 16,
    textAlign: 'center',
  },
  accent: {
    color: '#453A2D',
  },
  settingButton: {
    color: 'gray',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 14,
  },
  nextButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default styles;
