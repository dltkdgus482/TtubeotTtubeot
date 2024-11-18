import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  alertBackground: {
    position: 'absolute',
    top: 120,
    width: '100%',
    height: 260,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  adventureAlert: {
    padding: 50,
    display: 'flex',
    justifyContent: 'space-between',
  },
  alertSection: {
    height: 80,
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 22,
    textAlign: 'center',
  },
  alertContent: {
    fontSize: 18,
    textAlign: 'left',
    paddingTop: 5,
  },
  accentText: {
    color: 'red',
  },
  accentTextBlue: {
    color: 'blue',
  },
  startButton: {
    position: 'absolute',
    bottom: 150,
    left: '50%',
    transform: [{translateX: -50}],
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    color: '#fff',
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
