import React from 'react';
import styles from './MissionModal.styles';
import { View, Image } from 'react-native';
import StyledText from '../../styles/StyledText';
const CompleteIcon = require('../../assets/icons/CompleteIcon.png');

interface MissionProps {
  missionActionCount: number; // 현재 진행도
  missionExplanation: string;
  missionName: string;
  missionStatus: string;
  missionTargetCount: number;
  missionTheme: number;
  missionType: number;
}

interface MissionListProps {
  missionList: MissionProps[];
}

import { useEffect } from 'react';

const missionImageSource = require('../../assets/images/RandomCharacter.png');

const MissionList = ({ missionList }: MissionListProps) => {
  useEffect(() => {
    console.log(missionList);
  }, [missionList]);
  return (
    <View>
      {missionList.length > 0 &&
        missionList.map((item, index) => {
          const progress =
            (item.missionActionCount / item.missionTargetCount) * 100;
          return (
            <View style={styles.item} key={index}>
              <View style={styles.itemImageContainer}>
                <Image source={missionImageSource} style={styles.itemImage} />
              </View>
              <View style={styles.itemInfoContainer}>
                <StyledText bold style={styles.itemName}>
                  {item.missionName}
                </StyledText>
                <StyledText bold>{item.missionExplanation}</StyledText>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[styles.progressBar, { width: `${progress}%` }]}
                  />
                  <StyledText bold style={styles.progressText}>
                    {item.missionActionCount} / {item.missionTargetCount}
                  </StyledText>
                </View>
              </View>
              <View style={styles.completeCheckBox}>
                {item.missionStatus !== 'IN_PROGRESS' && (
                  <Image source={CompleteIcon} style={styles.completeCheck} />
                )}
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default MissionList;
