import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backGround: {
    flex: 1,
    backgroundColor: '#C7E5C4',
  },
  topThreeList: {
    width: '100%',
    height: '26%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
  },
  first: {
    width: '20%',
    height: '65%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#EBC11B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  second: {
    width: '20%',
    height: '45%',
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
    backgroundColor: '#F5F8FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    minHeight: 300, // 최소 높이 설정 (예: 300)
  },
  rankingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10, // 상하 여백을 사용해 높이를 유동적으로 만듦
    paddingHorizontal: '3%', // 좌우 여백을 화면 비율에 맞게 설정
    marginHorizontal: '2%', // 컨테이너 간의 여백을 화면 비율에 맞게 설정
    backgroundColor: '#F5F8FA',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: '100%', // 컨테이너가 화면의 대부분을 차지하도록 설정
  },

  ranking: {
    width: '14%',
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  rankingImage: {
    width: 60,
    height: 60,
    marginLeft: -10,
  },
  rankingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '84%',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    padding: '1%',
    paddingHorizontal: '5%',
  },
  rankingName: {
    width: '45%',
    fontSize: 18,
    textAlign: 'center',
  },
  rankingScore: {
    width: '25%',
    fontSize: 16,
    textAlign: 'right',
  },
  medal: {
    position: 'absolute',
    top: 0,
  },
  playerImage: {
    width: 55,
    height: 55,
    marginTop: 8,
  },
  playerName: {
    fontSize: 14,
    position: 'absolute',
    top: -30,
  },
  playerImageContainer: {
    position: 'absolute',
    top: -80,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 원을 벗어나는 이미지 숨기기
  },
  underPlayerImageContainer: {
    top: -80,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 원을 벗어나는 이미지 숨기기
  },
});

export default styles;
