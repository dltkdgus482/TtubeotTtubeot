import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backGround: {
    flex: 1,
    backgroundColor: '#C7E5C4',
  },
  topThreeList: {
    width: '100%',
    height: '26%',
    marginVertical: '1%',
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
  },
  first: {
    width: '20%',
    height: '80%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#EBC11B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  second: {
    width: '20%',
    height: '50%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#D6CCA6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  third: {
    width: '20%',
    height: '30%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#E79E5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingList: {
    width: '100%',
    height: '55%',
    marginVertical: '1%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 25,
  },
  rankingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    height: 80,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  ranking: {
    fontSize: 20,
  },
});

export default styles;
