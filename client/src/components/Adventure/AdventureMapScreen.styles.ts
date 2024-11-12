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
    height: 460,
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
    height: 463,
    width: '100%',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderWidth: 5,
    borderRadius: 25,
  },
  nearbyUserList: {
    position: 'absolute',
    fontSize: 20,
    zIndex: 10000,
    top: 40,
    left: 15,
  },
});

export default styles;
