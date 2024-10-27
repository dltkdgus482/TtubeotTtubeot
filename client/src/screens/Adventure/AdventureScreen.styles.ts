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
    left: 85,
  },
  content: {
    flex: 1,
    paddingTop: 120,
  },
  alertBackground: {
    position: 'absolute',
    top: 120,
    width: '100%',
    height: 250,
    resizeMode: 'stretch',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  adventureAlert: {
    padding: 20,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  alertContentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  alertContent: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertContentLast: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default styles;
