import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import styles from './RankingScreen.styles';
import StyledText from '../../styles/StyledText';
import RankingScreenButtonContainer from './RankingScreenButtonContainer';
import { dummyRankingList } from './dummyData';
import { getRankingInfo } from '../../utils/apis/Ranking/getRankingInfo';
import { useUser } from '../../store/user';
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
  ttubeot_id: number;
}

const RankingScreen = () => {
  const [selected, setSelected] = useState('뚜벗 랭킹');
  const [rankingList, setRankingList] = useState<RankingProps[]>([]);

  useEffect(() => {
    const fetchRankingInfo = async () => {
      const res = await getRankingInfo();
      setRankingList(res);
      console.log('rankingInfo', res);
    };

    fetchRankingInfo();
  }, []);

  return (
    <View style={styles.backGround}>
      <RankingScreenButtonContainer />
      <View style={styles.topThreeList}>
        <View style={styles.second}>
          <View style={styles.playerImageContainer}>
            <Image source={ttubeotDog} style={styles.playerImage} />
          </View>
          {/* <StyledText bold style={styles.playerName}>
            {rankingList[1].username}
          </StyledText> */}
          <Image source={silver} style={styles.medal} />
        </View>
        <View style={styles.first}>
          <View style={styles.playerImageContainer}>
            <Image source={ttubeotDog} style={styles.playerImage} />
          </View>
          {/* <StyledText bold style={styles.playerName}>
            {rankingList[0].username}
          </StyledText> */}
          <Image source={gold} style={styles.medal} />
        </View>
        <View style={styles.third}>
          <View style={styles.playerImageContainer}>
            <Image source={ttubeotDog} style={styles.playerImage} />
          </View>
          {/* <StyledText bold style={styles.playerName}>
            {rankingList[2].username}
          </StyledText> */}
          <Image source={bronze} style={styles.medal} />
        </View>
      </View>
      <ScrollView
        style={styles.rankingList}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {rankingList.map(
          (ranking, index) =>
            index > 2 &&
            index < 999 && (
              <View style={styles.rankingContainer} key={index}>
                <StyledText bold style={styles.ranking}>
                  {index + 1}
                </StyledText>
                <View style={styles.rankingInfo}>
                  <Image
                    source={IntroTtubeotRabbit}
                    style={styles.rankingImage}
                  />
                  <StyledText bold style={styles.rankingName}>
                    {ranking.username}
                  </StyledText>
                  <StyledText bold style={styles.rankingScore}>
                    {ranking.score.toLocaleString()}
                  </StyledText>
                </View>
              </View>
            ),
        )}
      </ScrollView>
    </View>
  );
};

export default RankingScreen;
