import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './MissionModal.styles';
import StyledText from '../../styles/StyledText';
import Icon from 'react-native-vector-icons/AntDesign';
import MissionList from './MissionList';
import NfcTagging from '../NFC/NfcTagging';
import {
  dailyMissionList,
  weeklyMissionList,
  achievementList,
} from './dummyData';
// ----------------------------------

import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

global.Buffer = require('buffer').Buffer;

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
  const [isNfcTagged, setIsNfcTagged] = useState<boolean>(false);
  const [nfcData, setNfcData] = useState<string>('');
  const [tagId, setTagId] = useState<string>('');

  useEffect(() => {
    NfcManager.start();
    NfcManager.isSupported();

    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const closeTagModal = async () => {
    setIsNfcTagged(false);
    await NfcManager.cancelTechnologyRequest();
  };

  const missionList: string[] = ['일일 미션', '주간 미션', '업적'];

  const handleNfcTagging = async () => {
    if (isNfcTagged === true) return;

    if (!NfcManager.isEnabled()) {
      console.log('NFC가 비활성화되어 있습니다.');
      return;
    }

    await NfcManager.requestTechnology([
      NfcTech.NdefFormatable,
      NfcTech.Ndef,
      NfcTech.NfcA,
    ]);

    // const tag = await NfcManager.getTag();
    // console.log(tag);

    // const message = Ndef.encodeMessage([Ndef.textRecord('12345')]);
    // await NfcManager.ndefHandler.writeNdefMessage(message);
    // 전송할 32비트 숫자를 바이트 배열로 변환
    const message = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
    const temp = Array.from(message);

    // `transceive`를 통해 데이터 전송
    const response = await NfcManager.nfcAHandler.transceive([
      0x12, 0x34, 0x56, 0x78,
    ]);

    console.log('NfcA Response:', response);

    try {
      if (selectedMenu === '일일 미션') {
      } else if (selectedMenu === '주간 미션') {
      }

      setIsNfcTagged(true);
      console.log('NFC 태깅 성공');
    } catch (ex) {
      console.log('NFC  태깅 실패', ex);
      handleNfcTagging();
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  };

  useEffect(() => {
    if (!isNfcTagged) {
      NfcManager.cancelTechnologyRequest();
      handleNfcTagging();
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
      {isNfcTagged && (
        <NfcTagging
          visible={isNfcTagged}
          onClose={closeTagModal}
          tagId={tagId}
        />
      )}
    </Modal>
  );
};

export default MissionModal;
