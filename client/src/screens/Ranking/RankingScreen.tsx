import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, ImageBackground, Text } from 'react-native';
import styles from './RankingScreen.styles';
import StyledText from '../../styles/StyledText';
import RankingScreenButtonContainer from './RankingScreenButtonContainer';
import { dummyRankingList } from './dummyData';
import { getRankingInfo } from '../../utils/apis/Ranking/getRankingInfo';
import { useUser } from '../../store/user';
import { profileColor } from '../../components/ProfileImageUrl';
import { useIsFocused } from '@react-navigation/native';
// import { useIsFocused } from '@react-navigation/native';

const IntroTtubeotRabbit = require('../../assets/ttubeot/IntroTtubeotRabbit.png');
const gold = require('../../assets/medals/gold.png');
const silver = require('../../assets/medals/silver.png');
const bronze = require('../../assets/medals/bronze.png');
const ttubeotDog = require('../../assets/ttubeot/IntroTtubeotDog.png');
const backgroundImage = require('../../assets/backgrounds/rankingBackgroundImage.jpg'); // 배경 이미지 경로 설정

interface RankingProps {
  user_id: number;
  username: string;
  score: number;
  ttubeotId: number;
}

const RankingScreen = () => {
  // const [selected, setSelected] = useState('뚜벗 랭킹');
  const [rankingList, setRankingList] = useState<RankingProps[]>([]);
  const isFocused = useIsFocused(); // 화면 포커스 여부 감지

  useEffect(() => {
    const fetchRankingInfo = async () => {
      const res = (await getRankingInfo()) as unknown as RankingProps[];
      setRankingList(res);
      // 반복문으로 한 줄씩 출력
      res.forEach((ranking, index) => {
        console.log(`Ranking ${index + 1}:`, ranking);
      });
    };

    if (isFocused) {
      // 화면이 포커스되었을 때만 실행
      fetchRankingInfo();
    }
  }, [isFocused]);

  return (
    <View style={styles.backGround}>
      <View style={styles.topContainer}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        />
        <StyledText bold style={styles.rankingText}>
          랭킹
        </StyledText>
        {/* 설명 텍스트 */}
        {/*<StyledText style={styles.rankingDescription}>
          이번 주 최고의 랭킹을 확인하세요!
        </StyledText>*/}
        {/* <RankingScreenButtonContainer /> */}
        <View style={styles.topThreeList}>
          {rankingList[1] && (
            <View style={styles.second}>
              <StyledText bold style={styles.playerName}>
                {rankingList[1].username}
              </StyledText>
              <View style={styles.playerImageContainer}>
                <Image
                  source={profileColor[rankingList[1].ttubeotId]}
                  style={{ width: 80, height: 80 }}
                />
              </View>
              <Image source={silver} style={styles.medal} />
            </View>
          )}
          {rankingList[0] && (
            <View style={styles.first}>
              <StyledText bold style={styles.playerName}>
                {rankingList[0].username}
              </StyledText>
              <View style={styles.playerImageContainer}>
                <Image
                  source={profileColor[rankingList[0].ttubeotId]}
                  style={{ width: 80, height: 80 }}
                />
              </View>
              <Image source={gold} style={styles.medal} />
            </View>
          )}
          {rankingList[2] && (
            <View style={styles.third}>
              <StyledText bold style={styles.playerName}>
                {rankingList[2].username}
              </StyledText>
              <View style={styles.playerImageContainer}>
                <Image
                  source={profileColor[rankingList[2].ttubeotId]}
                  style={{ width: 80, height: 80 }}
                />
              </View>
              <Image source={bronze} style={styles.medal} />
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.rankingList}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {rankingList.map((ranking, index) => {
          if (index <= 2 || index >= 999) return null;

          return (
            <View style={styles.rankingContainer} key={index}>
              <StyledText bold style={styles.ranking}>
                {(index + 1).toString().padStart(2, '0')}
              </StyledText>
              <View style={styles.rankingInfo}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={profileColor[ranking.ttubeotId] || profileColor[1]}
                    style={styles.playerImage}
                  />
                </View>
                <StyledText bold style={styles.rankingName}>
                  {ranking.username}
                </StyledText>
                <StyledText
                  bold
                  style={[
                    styles.rankingScore,
                    ranking.score >= 1000 ? { fontSize: 14 } : null, // 1000 이상일 때 폰트 크기 조정
                  ]}>
                  {ranking.score.toLocaleString()}
                </StyledText>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default RankingScreen;
