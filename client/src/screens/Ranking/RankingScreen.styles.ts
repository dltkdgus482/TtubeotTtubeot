import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backGround: {
    flex: 1,
    justifyContent: 'center', // 필요 시 중앙 정렬 추가
    alignItems: 'center', // 필요 시 중앙 정렬 추가
    backgroundColor: '#C7E5C4',
  },
  topContainer: {
    flex: 1,
    minHeight: 400,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute', // 배경 이미지를 전체 화면에 고정
    opacity: 0.9, // 흐릿하게 보이도록 투명도 조절
  },
  titleImage: {
    position: 'absolute',
    resizeMode: 'contain',
    width: 240,
    height: 130,
    top: 50,
  },
  topThreeList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    top: '5%',
    gap: 10,
    paddingVertical: 20,
  },
  first: {
    width: '20%',
    height: '90%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFED97',
    justifyContent: 'center',
    alignItems: 'center',
  },
  second: {
    width: '20%',
    height: '65%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#E2EBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  third: {
    width: '20%',
    height: '45%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FDB777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: '5%', // 좌우 여백을 화면 비율에 맞게 설정
    marginHorizontal: '2%', // 컨테이너 간의 여백을 화면 비율에 맞게 설정
    borderRadius: 20,
    shadowRadius: 5,
    width: '100%', // 컨테이너가 화면의 대부분을 차지하도록 설정
    height: 80,
  },

  ranking: {
    fontSize: 24,
    // justifyContent: 'flex-start', // 상위 컨테이너 안에서 왼쪽 정렬
    alignItems: 'flex-start', // 세로로도 왼쪽 정렬
    textAlign: 'left', // 텍스트 왼쪽 정렬
    marginLeft: -15, // 음수 값을 주어 좀 더 왼쪽으로 이동
  },
  rankingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    backgroundColor: '#F5F8FA',
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: '5%',
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#F1F1F1',
  },
  isMerankingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    backgroundColor: '#F5F8FA',
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: '5%',
    borderWidth: 2,
    borderColor: '#b4d7ee',
  },
  rankingName: {
    fontSize: 18,
  },
  rankingScore: {
    fontSize: 16,
    textAlign: 'right',
    marginRight: 8,
  },
  medal: {
    position: 'absolute',
    top: 10,
    height: 45,
    objectFit: 'contain',
  },
  top3PlayerImage: {
    width: 80,
    height: 80,
  },
  playerImage: {
    width: 70,
    height: 70,
  },
  playerName: {
    width: 120,
    fontSize: 16,
    position: 'absolute',
    top: -110,
    textAlign: 'center',
    color: '#393331',
  },
  top3PlayerImageContainer: {
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
  rankingText: {
    top: '18%',
    fontSize: 26, // 글자 크기
    textAlign: 'center', // 중앙 정렬
  },
  rankingDescription: {
    fontSize: 16,
    color: '#666', // 설명 텍스트 색상 (필요에 따라 조정)
    textAlign: 'center', // 설명 텍스트 중앙 정렬
    marginTop: 30, // 상단 텍스트와 간격
    marginBottom: 20, // 배경 이미지 및 버튼 컨테이너와의 간격
  },
  imageWrapper: {
    width: 55,
    height: 55,
    borderRadius: 50, // width와 height의 절반 값으로 설정해 원형 만들기
    backgroundColor: 'white', // 흰색 배경
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 원을 벗어나는 이미지 숨기기
    marginRight: 15, // 이미지와 이름 사이 간격
  },
  textWrapper: {
    alignItems: 'flex-start', // 텍스트 요소들을 왼쪽 정렬
    flexDirection: 'column', // 세로 방향으로 정렬
    flex: 1, // 가능한 모든 공간을 차지하도록 설정
  },
  nameAndScore: {
    flexDirection: 'row', // 이름과 점수를 가로로 배치
    rowGap: 20,
    justifyContent: 'flex-end',
    alignItems: 'center', // 세로 가운데 정렬
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // 오른쪽 끝으로 이동
  },
  highlightedContainer: {
    borderRadius: 10,
    borderColor: '#E6E6E6',
    borderWidth: 4,
    margin: -4, // 테두리 크기만큼 마진을 설정하여 위치 고정
  },

  highlightedBorder: {
    borderWidth: 5, // 강조된 테두리 두께
    borderColor: '#FFD700', // 테두리 색상 (예: 금색)
    borderRadius: 50, // 이미지에 맞게 설정
    padding: 5, // 내부 여백을 추가하여 기존 테두리 바깥쪽에 강조 테두리 표시
  },
});

export default styles;
