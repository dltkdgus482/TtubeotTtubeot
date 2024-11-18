import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  titleContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 350,
    height: 60,
  },
  withContainer: {
    position: 'absolute',
    top: 200,
    left: 35,
    right: -35,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  withTtubeot: {
    width: 290,
    height: 88,
  },
  buttonContainer: {
    position: 'absolute',
    top: 300,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
  },
  ttubeotContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  dogContainer: {
    position: 'absolute',
    left: -10,
    bottom: 50,
  },
  dog: {
    width: 180,
    height: 180,
  },
  sheepContainer: {
    position: 'absolute',
    left: -20,
    bottom: 170,
  },
  sheep: {
    width: 200,
    height: 200,
  },
  penguinContainer: {
    position: 'absolute',
    right: 60,
    bottom: 185,
  },
  penguin: {
    width: 200,
    height: 200,
  },
  rhinocerosContainer: {
    position: 'absolute',
    right: -50,
    bottom: 245,
  },
  rhinoceros: {
    width: 210,
    height: 210,
  },
  hippoContainer: {
    position: 'absolute',
    right: -80,
    bottom: 50,
  },
  hippo: {
    width: 310,
    height: 310,
  },
  rabbitContainer: {
    position: 'absolute',
    left: 110,
    bottom: 30,
  },
  rabbit: {
    width: 130,
    height: 130,
  },
});

export default styles;
