import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    height: '89%',
  },
  titleBackContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: 30,
    backgroundColor: '#DFD6C0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleBackImage: {
    width: '100%',
    height: 52,
    resizeMode: 'stretch',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    top: 20,
    right: 16,
  },
  friendsContainer: {
    width: '100%',
    height: '50%',
    flex: 1,
    gap: 8,
  },
  friends: {
    width: '94%',
    height: 80,
    alignSelf: 'center',
    backgroundColor: '#F3EBD8',
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
    elevation: 3,
    borderRadius: 20,
  },
  friendImageContainer: {
    width: '17%',
    marginLeft: 3,
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
  },
  sendCoin: {
    width: '14%',
  },
  sendCoinIcon: {
    position: 'absolute',
    top: 5,
    left: 8,
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
});

export default styles;
