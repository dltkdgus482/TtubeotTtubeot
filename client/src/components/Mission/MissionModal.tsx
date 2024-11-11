import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './MissionModal.styles';
import StyledText from '../../styles/StyledText';
import Icon from 'react-native-vector-icons/AntDesign';
import MissionList from './MissionList';
import {
  dailyMissionList,
  weeklyMissionList,
  achievementList,
} from './dummyData';
import { useUser } from '../../store/user';
import {
  getDailyMissionList,
  getWeeklyMissionList,
} from '../../utils/apis/Mission/getMissionList';
import { authRequest } from '../../utils/apis/request';

const CharacterShopTitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const CharacterShopBackgound = require('../../assets/images/CharacterShopBackground.png');

interface CharacterShopModalProps {
  missionModalVisible: boolean;
  closeMissionModal: () => void;
}

const MissionModal: React.FC<CharacterShopModalProps> = ({
  missionModalVisible,
  closeMissionModal,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('일일 미션');
  const missionList: string[] = ['일일 미션', '주간 미션', '업적'];
  const { accessToken, setAccessToken } = useUser.getState();
  const authClient = authRequest(accessToken, setAccessToken);

  useEffect(() => {
    if (missionModalVisible === false) return;

    const fetchDailyMissionlist = async () => {
      const res = await getDailyMissionList(accessToken, setAccessToken);
    };

    const fetchWeeklyMissionlist = async () => {
      const res = await getWeeklyMissionList(accessToken, setAccessToken);
    };

    if (selectedMenu === '일일 미션') {
      fetchDailyMissionlist();
    }

    if (selectedMenu === '주간 미션') {
      fetchWeeklyMissionlist();
    }
  }, [missionModalVisible, selectedMenu]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={missionModalVisible}
      onRequestClose={() => {
        closeMissionModal();
        setSelectedMenu('일일 미션');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.titleBackContainer}>
            <Image
              source={CharacterShopBackgound}
              style={styles.titleBackImage}
            />
          </View>
          <View style={styles.titleContainer}>
            <Image
              source={CharacterShopTitleContainer}
              style={styles.titleImage}
            />
            <StyledText bold style={styles.title}>
              미션
            </StyledText>
            <Icon
              name="close"
              size={30}
              color="black"
              style={styles.closeButton}
              onPress={() => {
                closeMissionModal();
                setSelectedMenu('일일 미션');
              }}
            />
          </View>

          <View style={styles.menuContainer}>
            {missionList.map((mission, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedMenu(mission)}>
                <View
                  style={
                    selectedMenu === mission
                      ? [styles.menu, styles.selectedMenu]
                      : styles.menu
                  }>
                  <View style={styles.stitchedBorder}></View>
                  <StyledText bold style={styles.menuText}>
                    {mission}
                  </StyledText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView style={styles.itemContainer}>
            <MissionList
              missionList={
                selectedMenu === '일일 미션'
                  ? dailyMissionList
                  : selectedMenu === '주간 미션'
                  ? weeklyMissionList
                  : achievementList
              }
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;
