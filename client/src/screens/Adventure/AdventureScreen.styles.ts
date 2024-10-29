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
    opacity: 0.62,
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
});

export default styles;
