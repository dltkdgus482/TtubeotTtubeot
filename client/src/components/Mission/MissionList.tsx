import React from 'react';
import styles from './MissionModal.styles';
import { View, Image } from 'react-native';
import StyledText from '../../styles/StyledText';

const CompleteIcon = require('../../assets/icons/CompleteIcon.png');

interface MissionProps {
  name: string;
  source: any;
  description: string;
  cur: number;
  goal: number;
}

interface MissionListProps {
  missionList: MissionProps[];
}

const MissionList = ({ missionList }: MissionListProps) => {
  return (
    <View>
      {missionList.map((item, index) => {
        const progress = (item.cur / item.goal) * 100;
        return (
          <View style={styles.item} key={index}>
            <View style={styles.itemImageContainer}>
              <Image source={item.source} style={styles.itemImage} />
            </View>
            <View style={styles.itemInfoContainer}>
              <StyledText bold style={styles.itemName}>
                {item.name}
              </StyledText>
              <StyledText bold>{item.description}</StyledText>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
                <StyledText bold style={styles.progressText}>
                  {item.cur} / {item.goal}
                </StyledText>
              </View>
            </View>
            <View style={styles.completeCheckBox}>
              {item.cur === item.goal && (
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
