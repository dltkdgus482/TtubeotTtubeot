import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  backgroundContainer: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  profileContainer: {
    position: 'absolute',
    top: 100,
    left: '50%',
    transform: [{ translateX: -100 }],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 200,
  },
  nickName: {
    fontSize: 20,
    marginTop: 10,
  },
  settingsContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 105,
  },
  settingsContent: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingsIconContainer3: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsIcon: {
    width: 15,
    height: 22,
  },
  settingsIcon3: {
    width: 18,
    height: 22,
  },
  settings: {
    fontSize: 18,
    marginTop: 10,
  },
  cancelUser: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  cancelUserButton: {
    backgroundColor: '#EBEBEB',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderRadius: 10,
  },
});

export default styles;
