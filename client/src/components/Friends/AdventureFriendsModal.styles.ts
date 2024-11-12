import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  modalView: {
    width: '100%',
    height: '89%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleBackContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: 30,
    backgroundColor: '#DFD6C0',
  },
  titleBackImage: {
    width: '104%',
    height: 50,
    resizeMode: 'stretch',
  },
  titleImage: {
    width: '30%',
    height: 55,
    resizeMode: 'stretch',
  },
  title: {
    position: 'absolute',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    top: 13,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
  },
  friendsContainer: {
    width: '100%',
    height: '50%',
    flex: 1,
    gap: 8,
  },
  friends: {
    width: '96%',
    height: 80,
    backgroundColor: '#F2E6D6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: '2%',
    marginVertical: '1%',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 5,
    borderRadius: 15,
  },
  friendImageContainer: {
    width: '17%',
    marginLeft: 10,
  },
  friendImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  friendContentsContainer: {
    width: '66%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
  },
  friendNickname: {
    fontSize: 18,
  },
  footPrintContainer: {
    width: '80%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footPrintIconContainer: {
    backgroundColor: '#C9D8A7',
    padding: 5,
    borderRadius: 8,
  },
  footPrintIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    color: '#3E4A3D',
  },
  footPrintText: {
    fontSize: 16,
    paddingTop: 3,
  },
  sendCoin: {
    width: '13%',
  },
  sendCoinIcon: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default styles;
