import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 20,
  },
  mapContainer: {
    height: 490,
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
    height: 493,
    width: '100%',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderWidth: 5,
    borderRadius: 25,
  },
});

export default styles;
