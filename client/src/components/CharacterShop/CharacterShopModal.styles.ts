import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  modalBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
