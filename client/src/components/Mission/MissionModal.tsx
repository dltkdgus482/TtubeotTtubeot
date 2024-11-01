import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './MissionModal.styles';
import StyledText from '../../styles/StyledText';
import Icon from 'react-native-vector-icons/AntDesign';

// ----------------------------------

import NfcManager, { NfcTech } from 'react-native-nfc-manager';

NfcManager.start();

// ----------------------------------

// Nfc 태깅 모달 테스트를 위한 컴포넌트

import NfcTagging from '../NFC/NfcTagging';

// ----------------------------------

const CharacterShopTitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const CharacterShopBackgound = require('../../assets/images/CharacterShopBackground.png');
const CoinIcon = require('../../assets/icons/coinIcon.png');
const CompleteIcon = require('../../assets/icons/CompleteIcon.png');

interface CharacterShopModalProps {
  missionModalVisible: boolean;
  closeMissionModal: () => void;
}

interface MissionProps {
  name: string;
  source: any;
  description: string;
  cur: number;
  goal: number;
}

const MissionModal: React.FC<CharacterShopModalProps> = ({
  missionModalVisible,
  closeMissionModal,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('일일 미션');
  const [isNfcTagged, setIsNfcTagged] = useState<boolean>(false);

  const closeTagModal = async () => {
    setIsNfcTagged(false);
    await NfcManager.cancelTechnologyRequest();
  };

  const missionList: string[] = ['일일 미션', '주간 미션', '업적'];
  const dailyMissionList: MissionProps[] = [
    {
      name: '뚜벗 쓰다듬기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '자신의 뚜벗과 상호작용 1회',
      cur: 1,
      goal: 1,
    },
    {
      name: '친구와 인사 나누기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '주변 친구들과 인사 2회',
      cur: 1,
      goal: 2,
    },
  ];

  const weeklyMissionList: MissionProps[] = [
    {
      name: '뚜벗 쓰다듬기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '자신의 뚜벗과 상호작용 1회',
      cur: 1,
      goal: 1,
    },
    {
      name: '친구와 인사 나누기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '주변 친구들과 인사 2회',
      cur: 1,
      goal: 2,
    },
    {
      name: '걷기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '10000보 걷기',
      cur: 5000,
      goal: 10000,
    },
  ];
  const achievementList: MissionProps[] = [
    {
      name: '뚜벗 쓰다듬기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '자신의 뚜벗과 상호작용 1회',
      cur: 1,
      goal: 1,
    },
    {
      name: '친구와 인사 나누기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '주변 친구들과 인사 2회',
      cur: 1,
      goal: 2,
    },
    {
      name: '걷기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '10000보 걷기',
      cur: 5000,
      goal: 10000,
    },
    {
      name: '뚜벗 쓰다듬기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '자신의 뚜벗과 상호작용 1회',
      cur: 1,
      goal: 1,
    },
    {
      name: '친구와 인사 나누기',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '주변 친구들과 인사 2회',
      cur: 1,
      goal: 2,
    },
  ];

  const readNfc = async () => {
    try {
      console.log(NfcManager);

      if (!NfcManager.isEnabled()) {
        return;
      }

      if (isNfcTagged === true) {
        return;
      }

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log(tag);
      setIsNfcTagged(true);
    } catch (ex) {
      await setSelectedMenu('업적');
      console.log('NFC Tagging failed', ex);
      NfcManager.cancelTechnologyRequest();
      readNfc();
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  useEffect(() => {
    if (!isNfcTagged) {
      NfcManager.cancelTechnologyRequest();
      readNfc();
    }
  }, [isNfcTagged]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={missionModalVisible}
      onRequestClose={closeMissionModal}>
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
                setIsNfcTagged(false);
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
            {selectedMenu === '일일 미션' &&
              dailyMissionList.map((item, index) => {
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
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${progress}%` },
                          ]}
                        />
                        <StyledText bold style={styles.progressText}>
                          {item.cur} / {item.goal}
                        </StyledText>
                      </View>
                    </View>
                    <View style={styles.completeCheckBox}>
                      {item.cur === item.goal && (
                        <Image
                          source={CompleteIcon}
                          style={styles.completeCheck}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            {selectedMenu === '주간 미션' &&
              weeklyMissionList.map((item, index) => {
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
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${progress}%` },
                          ]}
                        />
                        <StyledText bold style={styles.progressText}>
                          {item.cur} / {item.goal}
                        </StyledText>
                      </View>
                    </View>
                    <View style={styles.completeCheckBox}>
                      {item.cur === item.goal && (
                        <Image
                          source={CompleteIcon}
                          style={styles.completeCheck}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            {selectedMenu === '업적' &&
              achievementList.map((item, index) => {
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
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${progress}%` },
                          ]}
                        />
                        <StyledText bold style={styles.progressText}>
                          {item.cur} / {item.goal}
                        </StyledText>
                      </View>
                    </View>
                    <View style={styles.completeCheckBox}>
                      {item.cur === item.goal && (
                        <Image
                          source={CompleteIcon}
                          style={styles.completeCheck}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
      {isNfcTagged && (
        <NfcTagging visible={isNfcTagged} onClose={closeTagModal} />
      )}
    </Modal>
  );
};

export default MissionModal;
