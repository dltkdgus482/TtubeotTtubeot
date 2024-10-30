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
    left: 75,
  },
  currencyContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
  },
  content: {
    position: 'absolute',
    width: 460,
    top: 0,
    left: '50%',
    transform: [{ translateX: -230 }],
    paddingTop: 120,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
