import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    paddingHorizontal: 20,
  },
  albumIcon: {
    width: 60,
    height: 60,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderColor: '#C7E5C4',
    borderWidth: 5,
    borderRadius: 25,
    paddingBottom: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapShadowContainer: {
    position: 'relative',
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
    top: 80,
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
    top: 125,
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
});

export default styles;
