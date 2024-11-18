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
    backgroundColor: '#5A6C4F',
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
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30,
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
    bottom: 80,
    width: '90%',
    height: 100,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 1002,
  },
  glowEffectContainer: {
    position: 'absolute',
    bottom: 0,
    left: -30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 1002,
  },
  glowEffect: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    zIndex: 1004,
  },
});

export default styles;
