import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  profileContainer: {
    position: 'absolute',
    top: 40,
    left: 75,
  },
  content: {
    flex: 1,
    paddingTop: 120,
  },

  startButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    width: '100%',
  },
  startButton: {
    position: 'absolute',
    bottom: 150,
  },
  buttonTextContainer: {
    width: 60,
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    top: 67,
    right: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  missionIcon: {
    width: 55,
    height: 55,
  },
  cameraIcon: {
    width: 55,
    height: 55,
  },
});

export default styles;
