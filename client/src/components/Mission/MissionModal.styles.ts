import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '92%',
    height: '45%',
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 100,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  MissionContainer: {
    minHeight: '45%',
    height: '45%',
    maxHeight: '45%',
  },
  MissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  MissionList: {
    flexDirection: 'column',
  },
  Mission: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  MissionName: {
    fontSize: 16,
    color: 'black',
    flex: 3,
  },
  MissionProgressBar: {
    flex: 3,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 10,
    position: 'relative',
  },
  MissionProgressFill: {
    height: '100%',
    backgroundColor: '#76c7c0',
    borderRadius: 10,
  },
  MissionStatus: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
});
