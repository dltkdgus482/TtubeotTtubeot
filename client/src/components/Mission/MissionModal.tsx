import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './MissionModal.styles';
import StyledText from '../../styles/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import MissionList from './MissionList';
import // dailyMissionList,
// weeklyMissionList,
// achievementList,
'./dummyData';
import { useUser } from '../../store/user';
import {
  getDailyMissionList,
  getWeeklyMissionList,
} from '../../utils/apis/Mission/getMissionList';
import { authRequest } from '../../utils/apis/request';
import { getInfoApi } from '../../utils/apis/users';
import { updateCoin } from '../../utils/apis/users/updateUserInfo';

const CharacterShopTitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const CharacterShopBackgound = require('../../assets/images/CharacterShopBackground.png');

interface CharacterShopModalProps {
  missionModalVisible: boolean;
  closeMissionModal: () => void;
}

interface MissionProps {
  missionActionCount: number;
  missionExplanation: string;
  missionName: string;
  missionStatus: string;
  missionTargetCount: number;
  missionTheme: number;
  missionType: number;
}

const MissionModal: React.FC<CharacterShopModalProps> = ({
  missionModalVisible,
  closeMissionModal,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('일일 미션');
  const missionList: string[] = ['일일 미션', '주간 미션', '업적'];
  const { accessToken, setAccessToken, user } = useUser.getState();
  const authClient = authRequest(accessToken, setAccessToken);
  const [dailyMissionList, setDailyMissionList] = useState<MissionProps[]>([]);
  const [weeklyMissionList, setWeeklyMissionList] = useState<MissionProps[]>(
    [],
  );
  const [achievementList, setAchievementList] = useState<MissionProps[]>([]);

  useEffect(() => {
    console.log('useEffect missionModalVisible, selectedMenu');

    if (missionModalVisible === false) return;

    const updateCoinInfo = async () => {
      const res = await getInfoApi(accessToken, setAccessToken);
      const newCoin = res.userCoin;
      updateCoin(newCoin);
    };

    const fetchDailyMissionlist = async () => {
      const res = await getDailyMissionList(accessToken, setAccessToken);
      setDailyMissionList(res);
    };

    const fetchWeeklyMissionlist = async () => {
      const res = await getWeeklyMissionList(accessToken, setAccessToken);
      setWeeklyMissionList(res);
    };

    if (selectedMenu === '일일 미션') {
      fetchDailyMissionlist();
    }

    if (selectedMenu === '주간 미션') {
      fetchWeeklyMissionlist();
    }

    updateCoinInfo();
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
                  : dailyMissionList
              }
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;
