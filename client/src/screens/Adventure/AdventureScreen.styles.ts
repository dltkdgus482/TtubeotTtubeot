import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  backgroundImage: {
    opacity: 0.65,
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
  content: {
    position: 'absolute',
    top: 140,
    width: '100%',
    paddingHorizontal: 0,
    display: 'flex',
  },
  startButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 120,
    width: '100%',
    zIndex: 100,
  },
  buttonContainer: {
    position: 'absolute',
    top: 75,
    right: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  missionIcon: {
    width: 55,
    height: 55,
  },
  cameraIcon: {
    width: 55,
    height: 57,
  },
  cameraContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    height: 800,
    width: 400,
  },
  camera: {
    position: 'absolute',
    top: 100,
    width: 400,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeCameraButton: {
    position: 'absolute',
    top: 60,
    right: 40,
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
  horseBalloonContainer: {
    position: 'absolute',
    top: 100,
    left: 80,
  },
  horseBalloon: {
    width: 100,
    height: 100,
  },
  horseBalloonText: {
    position: 'absolute',
    top: 28,
    left: 17,
    fontSize: 14,
  },
});

export default styles;
