import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tagModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tagModalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  tagModal: {
    width: '80%',
    height: '42%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  tagTitleContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '28%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tagTitle: {
    fontSize: 24,
    color: 'black',
  },
  tagSubTitle: {
    fontSize: 16,
    color: 'gray',
  },
  nameStyle: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileContainer: {
    height: '50%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
