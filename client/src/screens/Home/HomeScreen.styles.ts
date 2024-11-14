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
    bottom: 390, // 캐릭터 위쪽에 말풍선 위치를 맞추기 위한 값 (코끼리만 440)
    left: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  horseBalloon: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  horseBalloonText: {
    position: 'absolute',
    top: 25,
    left: 34,
    fontSize: 24,
    color: 'black',
  },
});
