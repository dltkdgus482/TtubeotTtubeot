import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 어두운 배경 추가
  },
  modalView: {
    width: '96%',
    height: '70%',
    padding: 40,
  },
  modalContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 30,
    minHeight: 180,
    padding: 20,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    flexDirection: 'row',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  ttubeotImageContainer: {
    // elevation: 1,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: '#F4F9FC',
  },
  ttubeotCharacterImage: {
    width: 120,
    height: 120,
  },
  buyConfirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyConfirmCoinIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 25,
    height: 25,
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
});
