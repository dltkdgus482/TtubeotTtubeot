import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backGround: {
    flex: 1,
    resizeMode: 'contain', // 이미지 비율을 유지하며 화면을 넓게 보여줌
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
    top: '10%',
    position: 'absolute', // 배경 이미지를 전체 화면에 고정
    opacity: 0.9, // 흐릿하게 보이도록 투명도 조절
  },
  // topThreeList: {
  //   width: '100%',
  //   height: '26%',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'flex-end',
  //   gap: 10,
  // },
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
    backgroundColor: '#EBC11B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  second: {
    width: '20%',
    height: '65%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#D6CCA6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  third: {
    width: '20%',
    height: '45%',
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
    // padding: 4,
    height: 80,
  },

  ranking: {
    fontSize: 30,
    justifyContent: 'flex-start', // 상위 컨테이너 안에서 왼쪽 정렬
    alignItems: 'flex-start', // 세로로도 왼쪽 정렬
    textAlign: 'left', // 텍스트 왼쪽 정렬
    marginLeft: -10, // 음수 값을 주어 좀 더 왼쪽으로 이동
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
    width: '90%',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    padding: '1%',
    paddingHorizontal: '5%',
  },
  rankingName: {
    width: 110,
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 'auto', // 이름을 이미지 바로 왼쪽에 고정
  },
  rankingScore: {
    width: '25%',
    fontSize: 20,
    textAlign: 'right',
  },
  medal: {
    position: 'absolute',
    top: 0,
  },
  nameAndScore: {
    flexDirection: 'row', // 이름과 점수를 가로로 배치
    alignItems: 'center', // 세로 가운데 정렬
    flex: 1, // 남는 공간을 차지하여 점수가 오른쪽 끝으로 가도록 함
  },
  playerImage: {
    width: 80,
    height: 80,
    marginTop: 8,
  },
  playerName: {
    width: 120,
    fontSize: 20,
    position: 'absolute',
    top: -110,
    textAlign: 'center',
    color: '#183118',
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
  rankingText: {
    // marginTop: 10,
    top: '20%',
    fontSize: 40, // 글자 크기
    // fontWeight: 'bold', // 두께
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
    width: 65,
    height: 65,
    borderRadius: 50, // width와 height의 절반 값으로 설정해 원형 만들기
    backgroundColor: 'white', // 흰색 배경
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 원을 벗어나는 이미지 숨기기
    marginRight: 10, // 이미지와 이름 사이 간격
  },
  textWrapper: {
    alignItems: 'flex-start', // 텍스트 요소들을 왼쪽 정렬
    flexDirection: 'column', // 세로 방향으로 정렬
    flex: 1, // 가능한 모든 공간을 차지하도록 설정
  },
  scoreContainer: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    marginLeft: 'auto', // 오른쪽 끝으로 배치
    width: 400,
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
