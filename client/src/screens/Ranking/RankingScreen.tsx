import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import styles from './RankingScreen.styles';
import StyledText from '../../styles/StyledText';
import RankingScreenButtonContainer from './RankingScreenButtonContainer';
import { dummyRankingList } from './dummyData';
import { getRankingInfo } from '../../utils/apis/Ranking/getRankingInfo';
import { useUser } from '../../store/user';

const IntroTtubeotRabbit = require('../../assets/ttubeot/IntroTtubeotRabbit.png');

interface RankingProps {
  user_id: number;
  username: string;
  score: number;
  ttubeot_id: number;
}

const RankingScreen = () => {
  const [selected, setSelected] = useState('뚜벗 랭킹');
  const { accessToken, setAccessToken } = useUser.getState();
  const [rankingList, setRankingList] =
    useState<RankingProps[]>(dummyRankingList);

  useEffect(() => {
    setRankingList(dummyRankingList);

    const fetchRankingInfo = async () => {
      const res = await getRankingInfo(accessToken, setAccessToken);
      // setRankingList(res);
      console.log(res);
    };

    // fetchRankingInfo();
  }, []);

  return (
    <View style={styles.backGround}>
      <RankingScreenButtonContainer />
      <View style={styles.topThreeList}>
        <View style={styles.second}>
          <StyledText bold>{rankingList[1].username}</StyledText>
        </View>
        <View style={styles.first}>
          <StyledText bold>{rankingList[0].username}</StyledText>
        </View>
        <View style={styles.third}>
          <StyledText bold>{rankingList[2].username}</StyledText>
        </View>
      </View>
      <ScrollView style={styles.rankingList}>
        {rankingList.map((ranking, index) => (
          <View style={styles.rankingContainer} key={index}>
            <StyledText bold style={styles.ranking}>
              {index + 1}
            </StyledText>
            <View style={styles.rankingInfo}>
              <Image source={IntroTtubeotRabbit} style={styles.rankingImage} />
              <StyledText bold style={styles.rankingName}>
                {ranking.username}
              </StyledText>
              <StyledText bold style={styles.rankingScore}>
                {ranking.score.toLocaleString()}
              </StyledText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RankingScreen;
