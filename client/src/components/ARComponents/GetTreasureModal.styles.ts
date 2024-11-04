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
    backgroundColor: 'white',
    borderRadius: 10,
  },
  treasureContainer: {
    width: '90%',
    height: '50%',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default styles;
