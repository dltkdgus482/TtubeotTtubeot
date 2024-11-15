import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
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
    // top: 100,
    top: 150,
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
    top: 55,
    left: 15,
  },
  currencyContainer: {
    position: 'absolute',
    top: 55,
    right: 10,
  },
  affectionContainer: {
    position: 'absolute',
    top: 90,
    right: 10,
  },
  ttubeotWebviewContainer: {
    position: 'absolute',
    bottom: -70,
    alignSelf: 'center',
  },
  eggContainer: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  ttubeotWebview: {
    width: 400,
    height: 500,
    // backgroundColor: 'white',
    backgroundColor: 'transparent',
  },
  ttubeotEggContainer: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
  },
  ttubeotEgg: {
    width: 250,
    height: 350,
    resizeMode: 'contain',
  },
  startButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    width: '100%',
  },
  horseBalloonContainer: {
    position: 'absolute',
    bottom: 390, // 기본
    left: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  horseBalloonBigContainer: {
    position: 'absolute',
    bottom: 460, // 키큰애들
    left: 75,
    alignSelf: 'center',
    alignItems: 'center',
  },
  horseBalloon: {
    width: 120,
    height: 110,
    resizeMode: 'stretch',
    opacity: 0.9,
  },
  balloonContent: {
    position: 'absolute',
    width: 36,
    height: 36,
    resizeMode: 'contain',
    top: 26, // 기본
    left: 42, // 기본
    fontSize: 24,
    color: 'black',
    opacity: 0.85,
  },
  balloonBigContent: {
    position: 'absolute',
    width: 36,
    height: 36,
    resizeMode: 'contain',
    top: 26, // 키큰애들
    left: 42, // 키큰애들
    fontSize: 24,
    color: 'black',
    opacity: 0.85,
  },
  meetingTtubeotButtonContainer: {
    position: 'absolute',
    bottom: 145,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingTtubeotButton: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  meetingTtubeotText: {
    position: 'absolute',
    color: '#49453B',
    bottom: 34,
    fontSize: 16,
    textAlign: 'center',
  },
});
