import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    opacity: 0.8,
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
});
