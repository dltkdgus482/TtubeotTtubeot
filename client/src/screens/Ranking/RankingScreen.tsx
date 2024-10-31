import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './RankingScreen.styles';
import StyledText from '../../styles/StyledText';
import RankingScreenButtonContainer from './RankingScreenButtonContainer';

interface RankingProps {
  ranking: number;
  name: string;
  source: any;
}

const RankingScreen = () => {
  const [selected, setSelected] = useState('뚜벗 랭킹');

  const rankingList: RankingProps[] = [
    {
      ranking: 1,
      name: 'First',
      source: require('../../assets/ttubeot/mockTtu.png'),
    },
    {
      ranking: 2,
      name: 'Second',
      source: require('../../assets/ttubeot/mockTtu.png'),
    },
    {
      ranking: 3,
      name: 'Third',
      source: require('../../assets/ttubeot/mockTtu.png'),
    },
  ];

  return (
    <View style={styles.backGround}>
      <RankingScreenButtonContainer />
      <View style={styles.topThreeList}>
        <View style={styles.second}>
          <StyledText bold>{rankingList[1].name}</StyledText>
        </View>
        <View style={styles.first}>
          <StyledText bold>{rankingList[0].name}</StyledText>
        </View>
        <View style={styles.third}>
          <StyledText bold>{rankingList[2].name}</StyledText>
        </View>
      </View>
      <View style={styles.rankingList}>
        {rankingList.map((ranking, index) => (
          <View style={styles.rankingContainer} key={index}>
            <StyledText bold style={styles.ranking}>
              {ranking.ranking.toString()}
            </StyledText>
            <Text>
              {ranking.ranking} | {ranking.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RankingScreen;
