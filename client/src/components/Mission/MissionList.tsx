import React from 'react';
import styles from './MissionModal.styles';
import { View, Image } from 'react-native';
import StyledText from '../../styles/StyledText';
import { useUser } from '../../store/user';
const CompleteIcon = require('../../assets/icons/CompleteIcon.png');

interface MissionProps {
  missionActionCount: number;
  missionExplanation: string;
  missionName: string;
  missionStatus: string;
  missionTargetCount: number;
  missionTheme: number;
  missionType: number;
}

interface MissionListProps {
  selectedMenu: string;
  missionList: MissionProps[];
}

import { useEffect } from 'react';

const missionImageSource = require('../../assets/images/RandomCharacter.png');
const hatIcon = require('../../assets/icons/hatIcon.png');
const handshakeIcon = require('../../assets/icons/handshakeIcon.png');
const forkAndKnifeIcon = require('../../assets/icons/forkAndKnifeIcon.png');

const MissionList = ({ selectedMenu, missionList }: MissionListProps) => {
  useEffect(() => {
    console.log(missionList);
  }, [missionList]);
  return (
    <View>
      {missionList.length > 0 &&
        missionList.map((item, index) => {
          if (
            selectedMenu === '일일 미션' &&
            item.missionStatus === 'COMPLETED'
          ) {
            return null;
          }

          if (selectedMenu === '완료' && item.missionStatus !== 'COMPLETED') {
            return null;
          }

          const missionTheme = item.missionTheme;

          const progress =
            (item.missionActionCount / item.missionTargetCount) * 100;
          return (
            <View style={styles.item} key={index}>
              <View style={styles.itemImageContainer}>
                <Image
                  source={
                    missionTheme === 0
                      ? forkAndKnifeIcon
                      : missionTheme === 1
                      ? hatIcon
                      : handshakeIcon
                  }
                  style={styles.itemImage}
                />
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
                {item.missionStatus === 'COMPLETED' && (
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
