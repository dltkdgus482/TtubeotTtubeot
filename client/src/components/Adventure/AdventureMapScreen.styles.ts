import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    top: 100,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumIcon: {
    width: 60,
    height: 60,
  },
  mapShadowContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderColor: '#C7E5C4',
    borderWidth: 5,
    borderRadius: 25,
    backgroundColor: 'white',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: 400,
  },
  mapShadow: {
    position: 'absolute',
    top: 0,
    height: 403,
    width: '100%',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderWidth: 5,
    borderRadius: 25,
  },
  nearbyUsersContainer: {
    position: 'absolute',
    fontSize: 20,
    zIndex: 10000,
    top: 25,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyUsersIcon: {
    position: 'absolute',
    width: 55,
    height: 55,
    zIndex: 10,
  },
  nearbyUsers: {
    left: 60,
    fontSize: 22,
    top: -2,
  },
  stepCounterContainer: {
    position: 'absolute',
    fontSize: 20,
    zIndex: 10000,
    top: 75,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCounterIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  stepCounter: {
    left: 63,
    fontSize: 22,
  },
  currentPositionContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 20,
    right: 10,
    zIndex: 1000,
  },
  currentPosition: {
    position: 'absolute',
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  markerContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerBackground: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 700,
    opacity: 0.25,
  },
  marker: {
    width: 35,
    height: 35,
    position: 'absolute',
    borderRadius: 200,
  },
  parkModalContainer: {
    position: 'absolute',
    top: 150,
    width: '80%',
    height: 200,
  },
});

export default styles;
