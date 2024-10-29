import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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
    marginTop: 25,
    backgroundColor: '#DFD6C0',
  },
  titleBackImage: {
    width: '100%',
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
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    top: 14,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menu: {
    width: 110,
    height: 45,
    backgroundColor: '#C1A492',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#7A574B',
    borderStyle: 'solid',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMenu: {
    width: 110,
    height: 45,
    backgroundColor: '#FCF3EA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#7A574B',
    borderStyle: 'solid',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#231514',
  },
  itemContainer: {
    width: '100%',
    height: '50%',
    flex: 1,
    backgroundColor: '#EAE6DD',
  },
  item: {
    width: '96%',
    height: 130,
    backgroundColor: '#F2E6D6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: '2%',
    marginVertical: '1%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 10,
  },
  itemInfoContainer: {
    flex: 0.75,
    flexDirection: 'column',
    gap: 10,
  },
  itemImageContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 7,
    borderWidth: 5,
    borderColor: '#8D6444',
  },
  itemImage: {
    width: 60,
    height: 60,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#231514',
  },
  itemDescription: {
    fontSize: 14,
    color: '#231514',
  },
  itemPriceContainer: {
    width: 85,
    height: 30,
    backgroundColor: '#CDC3B9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPriceInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FDF4ED',
    borderRadius: 6,
    width: '90%',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#231514',
  },
  coinIcon: {
    width: 23,
    height: 23,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
});