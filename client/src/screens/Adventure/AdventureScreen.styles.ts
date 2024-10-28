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
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertContent: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 3,
  },
  accentText: {
    color: 'red',
  },
  accentTextBlue: {
    color: 'blue',
  },
});

export default styles;
