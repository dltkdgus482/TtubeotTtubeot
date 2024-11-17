import { StyleSheet } from 'react-native';
import { contain } from 'three/src/extras/TextureUtils.js';

const styles = StyleSheet.create({
  modalBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    height: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 999,
  },
  background: {
    width: 380,
    height: 200,
  },
  titleContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 1001,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  ttubeotWebviewContainer: {
    zIndex: 1000,
    position: 'absolute',
    alignItems: 'center',
    width: 300,
    height: 500,
  },
  ttubeotWebview: {
    width: 400,
    height: 500,
    backgroundColor: 'transparent',
  },
  treasureContainer: {
    position: 'absolute',
    bottom: 65,
    width: '90%',
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  treasure: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  treasureCount: {
    fontSize: 20,
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 25,
  },
});

export default styles;
