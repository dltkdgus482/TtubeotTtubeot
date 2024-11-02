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

import { stringToByteArray, byteArrayToString } from '../../utils/apis/Ble';

// ---------------bluetooth-------------------

import BLEAdvertiser from 'react-native-ble-advertiser';

import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import BleManager, {
  BleScanMode,
  BleScanMatchMode,
  BleScanCallbackType,
  Peripheral,
} from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// ---------------bluetooth-------------------

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
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(
    null,
  );
  const missionList: string[] = ['일일 미션', '주간 미션', '업적'];

  const closeTagModal = async () => {
    setIsNfcTagged(false);
  };

  const handleConnectPeripheral = async (
    peripheral: Peripheral | { id: string },
  ) => {
    const peripheralId =
      typeof peripheral === 'string' ? peripheral : peripheral.id;

    console.log(`Connected to peripheral: ${peripheralId}`);
    setConnectedDevice(peripheral as Peripheral); // 기본 연결된 장치 설정
    console.log('Peripheral', peripheral as Peripheral);

    try {
      const peripheralInfo = await BleManager.retrieveServices(peripheralId);
      console.log('Peripheral services and characteristics:', peripheralInfo);
      const deviceUUID = peripheralInfo.id;
      console.log(`Device UUID: ${deviceUUID}`);

      // 필요한 경우 setConnectedDevice(peripheralInfo) 호출로 상태 업데이트
      setConnectedDevice({ ...peripheral, ...peripheralInfo });
    } catch (error) {
      console.log('Error retrieving services:', error);
    }
  };

  const handleDisconnectPeripheral = (peripheral: Peripheral) => {
    console.log(`Disconnected from peripheral: ${peripheral}`);
    setConnectedDevice(null);
  };

  const handleStopScan = async () => {
    console.log('Scan stopped!');
    setIsScanning(false);
  };

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager started!');
    });

    const requestPermissions = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
      }
    };

    requestPermissions();

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
      if (peripheral.advertising.isConnectable === false) return;

      // 필터링된 UUID만 검색
      const serviceUUID = '12345678-1234-5678-1234-56789abcdef0';
      if (peripheral.advertising.serviceUUIDs?.includes(serviceUUID)) {
        const manufactureData = JSON.stringify(
          peripheral.advertising.manufacturerData['004c'],
        );
        setDevices(prevDevices => {
          console.log('Discovered peripheral:', peripheral);
          console.log(manufactureData);

          // 중복 추가 방지
          const newDevices = prevDevices.some(
            device => device.id === peripheral.id,
          )
            ? prevDevices
            : [...prevDevices, peripheral];

          // RSSI 기준으로 정렬
          return newDevices.sort(
            (a, b) => (b.rssi || -Infinity) - (a.rssi || -Infinity),
          );
        });
      }
    };

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      handleConnectPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectPeripheral,
    );

    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerConnectPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    };
  }, []);

  const startScan = () => {
    if (isScanning === true) return;

    setIsScanning(true);
    BleManager.scan([], 3, true, {
      matchMode: BleScanMatchMode.Sticky,
      scanMode: BleScanMode.LowLatency,
      callbackType: BleScanCallbackType.AllMatches,
    })
      .then(() => {
        console.log('Scanning started...');
      })
      .catch(e => {
        console.log('Scan error', e);
        setIsScanning(false);
      });
  };

  const startAdvertising = () => {
    const message = 'ssgs20';
    const messageBytes = stringToByteArray(message);

    BLEAdvertiser.setCompanyId(0x004c);
    BLEAdvertiser.broadcast(
      '12345678-1234-5678-1234-56789abcdef0',
      messageBytes,
      {},
    )
      .then(success => console.log('Broadcast success', success))
      .catch(error => console.error('Broadcast error', error));
  };

  useEffect(() => {
    if (selectedMenu === '주간 미션') {
      startAdvertising();
    } else if (selectedMenu === '업적') {
      startScan();
    } else {
      BLEAdvertiser.stopBroadcast()
        .then(() => console.log('Stopped advertising'))
        .catch(error => console.log('Stop advertising error:', error));
      BleManager.stopScan();
      setIsScanning(false);
    }
  }, [selectedMenu]);

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
        <NfcTagging visible={isNfcTagged} onClose={closeTagModal} />
      )}
    </Modal>
  );
};

export default MissionModal;
