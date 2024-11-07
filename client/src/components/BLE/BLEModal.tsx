import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, Text, Button } from 'react-native';
import styles from './BLEModal.styles';
import {
  stringToByteArray,
  byteArrayToString,
  requestPermissions,
} from '../../utils/apis/Ble';

import StepCounter from '../StepCounter/StepCounter';

// ---------------bluetooth-------------------

import BLEAdvertiser from 'react-native-ble-advertiser';

import { NativeModules, NativeEventEmitter } from 'react-native';

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

import NfcTagging from '../NFC/NfcTagging';

interface BLEModalProps {
  modalVisible: boolean;
  closeBLEModal: () => void;
}

const BLEModal: React.FC<BLEModalProps> = ({ modalVisible, closeBLEModal }) => {
  const [isNfcTagged, setIsNfcTagged] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isAdvertising, setIsAdvertising] = useState<boolean>(false);
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const [bluetoothId, setBluetoothId] = useState<string>('');
  const devicesRef = useRef<Peripheral[]>([]);

  const closeTagModal = async () => {
    setIsNfcTagged(false);
  };

  const stopAdvertising = async () => {
    try {
      await BLEAdvertiser.stopBroadcast();
      setIsAdvertising(false);
      console.log('stopAdvertising');
    } catch (error) {
      console.log('stopAdvertising', error);
    }
  };

  const stopScanning = async () => {
    try {
      await BleManager.stopScan();
      setIsScanning(false);
      console.log('stopScanning');
    } catch (error) {
      console.log('stopScanning', error);
    }
  };

  const handleStopScan = async () => {
    console.log('Scan stopped!');
    setIsScanning(false);

    console.log(devicesRef.current);

    if (devicesRef.current.length === 0) return;

    setTimeout(() => {
      const sortedDevices = [...devicesRef.current].sort(
        (a, b) => (b.rssi || -Infinity) - (a.rssi || -Infinity),
      );

      if (sortedDevices.length === 0) {
        setBluetoothId('No Device Found');
        setIsNfcTagged(true);
        return;
      }

      const closestDevice = sortedDevices[0];
      const manufactureData =
        closestDevice.advertising.manufacturerData['004c'];
      const closestDeviceBluetoothId = byteArrayToString(manufactureData.bytes);
      setBluetoothId(closestDeviceBluetoothId);
      setIsNfcTagged(true);
    }, 1000);
  };

  // BLE 초기화

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager started!');
    });

    requestPermissions();

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  // BLE 초기화

  // scan 관련 로직

  const startScan = () => {
    if (isScanning === true) return;

    setIsScanning(true);
    BleManager.scan([], 5, true, {
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

  const handleDiscoverPeripheral = async (peripheral: Peripheral) => {
    if (peripheral.advertising.isConnectable === false) return;

    // 필터링된 UUID만 검색
    const serviceUUID = '12345678-1234-5678-1234-56789abcdef0';
    if (peripheral.advertising.serviceUUIDs?.includes(serviceUUID)) {
      console.log('peripheral', peripheral);

      setDevices(prevDevices => {
        const exists = prevDevices.some(device => device.id === peripheral.id);
        if (!exists) {
          const updatedDevices = [...prevDevices, peripheral];
          devicesRef.current = updatedDevices;
          return updatedDevices;
        }
        return prevDevices;
      });
    }
  };

  // scan 관련 로직

  // advertise 관련 로직

  const startAdvertising = () => {
    if (isAdvertising === true) return;

    setIsAdvertising(true);
    const message = '241104';
    const messageBytes = stringToByteArray(message);

    BLEAdvertiser.setCompanyId(0x004c);
    BLEAdvertiser.broadcast('', messageBytes, {})
      .then(success => console.log('Broadcast success', success))
      .catch(error => console.error('Broadcast error', error));
  };

  // advertise 관련 로직

  const handleCloseBLEModal = async () => {
    if (isScanning === true) {
      console.log('cannot close modal while scanning');
      return;
    }

    setIsNfcTagged(false);

    if (isAdvertising === true) {
      await stopAdvertising();
    }

    closeBLEModal();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseBLEModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>레전드 블루투스</Text>
            <StepCounter />
            <Button
              title={isAdvertising ? 'Stop Advertising' : 'Start Advertising'}
              onPress={() => {
                isAdvertising ? stopAdvertising() : startAdvertising();
                isScanning ? stopScanning() : startScan();
              }}
            />
            <Button
              title={isScanning ? 'Stop Scanning' : 'Start Scanning'}
              onPress={() => {
                isAdvertising ? stopAdvertising() : startAdvertising();
                isScanning ? stopScanning() : startScan();
              }}
            />
            <Button title="Close BLEModal" onPress={handleCloseBLEModal} />
          </View>
        </View>
      </Modal>
      {isNfcTagged && (
        <NfcTagging
          visible={isNfcTagged}
          onClose={() => {
            closeTagModal();
          }}
          bluetoothId={bluetoothId}
        />
      )}
    </>
  );
};

export default BLEModal;
