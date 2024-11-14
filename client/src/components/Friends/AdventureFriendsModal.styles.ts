import { StyleSheet } from 'react-native';
import { RigidBody } from 'three/examples/jsm/Addons.js';

const styles = StyleSheet.create({
  modalBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '60%',
    height: '35%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    top: -105,
    right: -45,
  },
  modalTitleContainer: {
    borderBottomWidth: 1,
    marginBottom: 9,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
  },
  friendContainer: {
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  friendImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  friendInfoContainer: {
    flexDirection: 'column',
  },
  coinImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default styles;
