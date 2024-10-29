import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    top: 100,
    justifyContent: 'center',
    alignContent: 'space-between',
    gap: 10,
  },
  shopIcon: {
    width: 60,
    height: 60,
  },
  missionIcon: {
    width: 60,
    height: 60,
  },
  albumIcon: {
    width: 60,
    height: 60,
  },
  profileContainer: {
    position: 'absolute',
    top: 40,
    left: 75,
  },
  currencyContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
  },
  ttubeotWebview: {
    position: 'absolute',
    bottom: -70,
    left: '50%',
    transform: [{ translateX: -250 }], // 모델의 너비의 절반으로 설정
    width: 500,
    height: 500,
    backgroundColor: 'transparent', // 투명 배경
  },
  startButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    width: '100%',
  },
});
