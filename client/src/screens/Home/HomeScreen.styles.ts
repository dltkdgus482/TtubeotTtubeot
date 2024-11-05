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
    left: 15,
  },
  currencyContainer: {
    position: 'absolute',
    top: 40,
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
    backgroundColor: 'transparent',
  },
  startButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    width: '100%',
  },
});
