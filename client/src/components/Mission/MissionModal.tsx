import React, {useState} from 'react';
import {View, Modal, Text, Button} from 'react-native';
import styles from './MissionModal.styles';

interface MissionModalProps {
  modalVisible: boolean;
  closeMissionModal: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({
  modalVisible,
  closeMissionModal,
}) => {
  const [dailyMissionList, setDailyMissionList] = useState([
    {
      missionName: '걸음 걷기',
      current: 303,
      goal: 2000,
    },
    {
      missionName: '친구와 인사 나누기',
      current: 0,
      goal: 1,
    },
    {
      missionName: '뚜벗 쓰다듬기',
      current: 1,
      goal: 1,
    },
  ]);
  const [weeklyMissionList, setWeeklyMissionList] = useState([
    {
      missionName: '걸음 걷기',
      current: 4006,
      goal: 10000,
    },
    {
      missionName: '모험 떠나기',
      current: 2,
      goal: 3,
    },
    {
      missionName: '뚜벗 밥 주기',
      current: 2,
      goal: 5,
    },
  ]);

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeMissionModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.MissionContainer}>
            <Text style={styles.MissionTitle}> ㅁ 오늘 할 일</Text>
            <View style={styles.MissionList}>
              {dailyMissionList.map((mission, index) => {
                return (
                  <View style={styles.Mission} key={index}>
                    <Text style={styles.MissionName}>
                      {index + 1}. {mission.missionName}
                    </Text>
                    <View style={styles.MissionProgressBar}>
                      <View
                        style={[
                          styles.MissionProgressFill,
                          {
                            width: `${calculateProgress(
                              mission.current,
                              mission.goal,
                            )}%`,
                          },
                        ]}
                      />
                      <Text
                        style={
                          styles.MissionStatus
                        }>{`${mission.current} / ${mission.goal}`}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.MissionContainer}>
            <Text style={styles.MissionTitle}>ㅁ 주간 미션</Text>
            <View style={styles.MissionList}>
              {weeklyMissionList.map((mission, index) => {
                return (
                  <View style={styles.Mission} key={index}>
                    <Text style={styles.MissionName}>
                      {index + 1}. {mission.missionName}
                    </Text>
                    <View style={styles.MissionProgressBar}>
                      <View
                        style={[
                          styles.MissionProgressFill,
                          {
                            width: `${calculateProgress(
                              mission.current,
                              mission.goal,
                            )}%`,
                          },
                        ]}
                      />
                      <Text
                        style={
                          styles.MissionStatus
                        }>{`${mission.current} / ${mission.goal}`}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <Button title="Close Shop" onPress={closeMissionModal} />
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;
