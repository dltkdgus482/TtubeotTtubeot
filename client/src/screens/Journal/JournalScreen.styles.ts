import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E9DE',
    alignItems: 'center',
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
  },
  backgroundCircle: {
    position: 'absolute',
    top: 0,
    left: -200,
    height: 500,
    width: 800,
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    backgroundColor: '#3E4A3D',
  },
  titleContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    height: 100,
  },
  title: {
    fontSize: 32,
  },
  adventureCount: {
    fontSize: 16,
    marginTop: 18,
  },
  journalContainer: {
    top: 160,
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  journalCard: {
    margin: 10,
    marginBottom: 15,
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  journalCardBackground: {
    position: 'absolute',
    top: 15,
    left: 0,
    width: 100,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  journalPicture: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: 70,
    height: 100,
    borderRadius: 10,
  },
  journalTitle: {
    paddingTop: 110,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  journalSubTitle: {
    marginTop: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default styles;
