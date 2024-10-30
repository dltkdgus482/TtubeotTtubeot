import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  containerText: {
    color: '#3F3F3F',
    marginTop: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    padding: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    paddingLeft: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 26,
    borderRadius: 20,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  modalDetailText: {
    color: 'black',
    lineHeight: 25,
    marginVertical: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  nextButton: {
    marginTop: 80,
  },
});
