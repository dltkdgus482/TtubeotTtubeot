import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
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
      <RankingScreenButtonContainer />
      <View style={styles.topThreeList}>
        {rankingList[1] && (
          <View style={styles.second}>
            <View style={styles.playerImageContainer}>
              <Image
                source={profileColor[rankingList[1].ttubeotId]}
                style={(styles.playerImage, { width: 80, height: 80 })}
              />
            </View>
            {/* <StyledText bold style={styles.playerName}>
        {rankingList[1].username}
      </StyledText> */}
            <Image source={silver} style={styles.medal} />
          </View>
        )}
        {rankingList[0] && (
          <View style={styles.first}>
            <View style={styles.playerImageContainer}>
              <Image
                source={profileColor[rankingList[0].ttubeotId]}
                style={(styles.playerImage, { width: 80, height: 80 })}
              />
            </View>
            {/* <StyledText bold style={styles.playerName}>
        {rankingList[0].username}
      </StyledText> */}
            <Image source={gold} style={styles.medal} />
          </View>
        )}
        {rankingList[2] && (
          <View style={styles.third}>
            <View style={styles.playerImageContainer}>
              <Image
                source={profileColor[rankingList[2].ttubeotId]}
                style={(styles.playerImage, { width: 80, height: 80 })}
              />
            </View>
            {/* <StyledText bold style={styles.playerName}>
        {rankingList[2].username}
      </StyledText> */}
            <Image source={bronze} style={styles.medal} />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.rankingList}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {rankingList.map((ranking, index) => {
          if (index <= 2 || index >= 999) return null;

          return (
            <View style={styles.rankingContainer} key={index}>
              <StyledText bold style={styles.ranking}>
                {index + 1}
              </StyledText>
              <View style={styles.rankingInfo}>
                <Image
                  source={profileColor[ranking.ttubeotId] || profileColor[1]}
                  style={(styles.playerImage, { width: 80, height: 80 })}
                />
                <StyledText bold style={styles.rankingName}>
                  {ranking.username}
                </StyledText>
                <StyledText bold style={styles.rankingScore}>
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
