import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Modal,
  Text,
  Button,
} from 'react-native';
import {
  decimalToAscii,
  asciiToDecimal,
  stringToByteArray,
  byteArrayToString,
  requestPermissions,
} from '../../utils/apis/Ble';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import styles from './AdventureMapScreen.styles';
import StyledText from '../../styles/StyledText';
import { mapStyle } from '../../styles/mapStyle';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import AdventureManager from '../../utils/apis/adventure/AdventureManager';
import NfcTagging from '../NFC/NfcTagging';
import { getUsername } from '../../utils/apis/adventure/getUsername';
import { useUser } from '../../store/user';

// ------------------------------

// BLE 관련 모듈 추가

import BLEAdvertiser from 'react-native-ble-advertiser';
import { SERVICE_UUID } from '@env';

import { NativeModules, NativeEventEmitter } from 'react-native';

import BleManager, {
  BleScanMode,
  BleScanMatchMode,
  Peripheral,
  BleScanCallbackType,
} from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

global.Buffer = require('buffer').Buffer;

// ------------------------------

interface AdventureMapScreenProps {
  steps: number;
}

interface UserProps {
  user_id: number;
  username: string;
  ttubeot_id: number;
  distance: number;
}

const AdventureMapScreen = ({ steps }: AdventureMapScreenProps) => {
  const { accessToken, setAccessToken } = useUser.getState();
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const mapRef = useRef<MapView>(null);
  const watchId = useRef<number | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Interval ID 추가
  const socketRef = useRef<AdventureManager | null>(null); // AdventureManager 인스턴스 관리
  const [isConnected, setIsConnected] = useState(true); // 소켓 연결 상태 추적
  const currentSteps = useRef<number>(0);
  const [nearbyUsers, setNearbyUsers] = useState<UserProps[]>([]);
  const [veryNearbyUsers, setVeryNearbyUsers] = useState<UserProps[]>([]);
  const [isNfcTagged, setIsNfcTagged] = useState<boolean>(false);
  const [opponentUsername, setOpponentUsername] = useState<string>('');
  const [opponentUserId, setOpponentUserId] = useState<number>(-1);

  // BLE 모드 관련 상태 추가
  const [isAdvertising, setIsAdvertising] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const devicesRef = useRef<Peripheral[]>([]);

  // BLE 관련 권한 요청
  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager is started');
    });

    requestPermissions();

    bleManagerEmitter.addListener('BleManagerStopScan', stopScanning);
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      discoverPeripheral,
    );

    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  // BLE 관련 함수 추가
  const startScanning = (): void => {
    if (isScanning === true) return;

    setIsScanning(true);
    BleManager.scan([], 5, true, {
      matchMode: BleScanMatchMode.Sticky,
      scanMode: BleScanMode.LowLatency,
      callbackType: BleScanCallbackType.AllMatches,
    })
      .then(() => {
        console.log('startScanning');
      })
      .catch(error => {
        console.log('startScanning error:', error);
        setIsScanning(false);
      });
  };

  const stopScanning = async (): Promise<void> => {
    if (isScanning === false) return;

    try {
      await BleManager.stopScan();
      setIsScanning(false);
      console.log('stopScanning');
    } catch (error) {
      console.log('stopScanning error:', error);
    }
  };

  const startAdvertising = (): void => {
    if (isAdvertising === true) return;

    setIsAdvertising(true);
    const { user } = useUser.getState();
    const userId = user.userId;
    const message = decimalToAscii(userId);
    const messageBytes = stringToByteArray(message);

    BLEAdvertiser.setCompanyId(0x004c);
    BLEAdvertiser.broadcast(SERVICE_UUID, messageBytes, {})
      .then(() => {
        console.log('startAdvertising');
      })
      .catch(error => {
        console.log('startAdvertising error:', error);
      });
  };

  const stopAdvertising = async (): Promise<void> => {
    if (isAdvertising === false) return;

    try {
      await BLEAdvertiser.stopBroadcast();
      setIsAdvertising(false);
      console.log('stopAdvertising');
    } catch (error) {
      console.log('stopAdvertising error:', error);
    }
  };

  const discoverPeripheral = async (peripheral: Peripheral) => {
    if (peripheral.advertising.isConnectable === false) return;

    if (peripheral.advertising.serviceUUIDs?.includes(SERVICE_UUID)) {
      console.log('주변 사용자 감지', peripheral);

      setDevices(prevDevices => {
        const exists = prevDevices.some(device => device.id === peripheral.id);

        if (exists === false) {
          const updatedDevices = [...prevDevices, peripheral];
          devicesRef.current = updatedDevices;
          return updatedDevices;
        }
        return prevDevices;
      });
    }
  };

  useEffect(() => {
    if (devicesRef.current.length === 0) return;
    console.log('useEffect devices');

    const sortedDevices = [...devicesRef.current].sort(
      (a, b) => (b.rssi || -Infinity) - (a.rssi || -Infinity),
    );

    const closestDevice = sortedDevices[0];
    const manufactureData = closestDevice.advertising.manufacturerData['004c'];
    const closestUserIdByteArray = byteArrayToString(manufactureData.bytes);
    const closestUserId = asciiToDecimal(closestUserIdByteArray);
    setOpponentUserId(closestUserId);

    getUsername(closestUserId).then(username => {
      setOpponentUsername(username);
      setIsNfcTagged(true);
    });
  }, [devices]);

  //------------------------------

  useEffect(() => {
    currentSteps.current = steps;
  }, [steps]);

  // -----------------------------

  // AdventureInfo의 싱글턴 인스턴스 가져오기
  useEffect(() => {
    if (socketRef.current === null) {
      socketRef.current = AdventureManager.getInstance();

      socketRef.current.addAdventureUserListener(data => {
        console.log('addAdventureUserListener', data);

        // 근처 사용자 목록 수신 시 상태 업데이트
        setNearbyUsers(data.users);
      });

      socketRef.current.addAdventureResultListener(data => {
        console.log('addAdventureResultListener:', data);

        // 모험 결과 수신 시 모달 띄우기
      });

      socketRef.current.addAdventureRequestListener(data => {
        console.log('addAdventureRequestListener', data);
        setOpponentUserId(data.user_id);
        setOpponentUsername(data.username);

        // 친구 요청 수신 시 모달 띄우기
        setIsNfcTagged(true);
      });

      socketRef.current.addAdventureConfirmListener(data => {
        console.log('친구 요청을 수신합니다', data);

        // 친구 요청 응답 수신 시 모달 닫기
        setIsNfcTagged(false);
      });
    }
  }, []);

  const fetchUsername = async (userId: number) => {
    try {
      const res = await getUsername(userId);
      setOpponentUsername(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('useEffect nearbyUsers', nearbyUsers.length);
    // 30m 이내 사용자 필터링
    setVeryNearbyUsers(nearbyUsers.filter(user => user.distance < 30));

    // 30m 이내 사용자 있을 경우 스캔, 광고 시작
    if (nearbyUsers.length === 0) {
      if (isScanning === true) {
        stopScanning();
      }

      if (isAdvertising === true) {
        stopAdvertising();
      }
      return;
    }

    if (isScanning === false) {
      startScanning();
    }

    if (isAdvertising === false) {
      startAdvertising();
    }
  }, [nearbyUsers]);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '이 앱이 위치에 접근하도록 허용하시겠습니까?',
          buttonNeutral: '나중에',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (!isConnected || !socketRef.current) {
      console.log('소켓이 연결되지 않아 위치 정보를 전송하지 않습니다.');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation(position.coords);

        setRegion(prevRegion => {
          if (prevRegion === null) {
            return {
              latitude,
              longitude,
              latitudeDelta: 0.01, // 초기 줌 레벨
              longitudeDelta: 0.01, // 초기 줌 레벨
            };
          }

          return {
            ...prevRegion,
            latitude,
            longitude,
          };
        });
        setLoading(false);

        socketRef.current.sendPosition({
          lat: latitude,
          lng: longitude,
          steps: currentSteps.current,
        });
      },
      error => {
        Alert.alert('위치 정보 오류', error.message);
        setErrorMessage('위치 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, [isConnected]);

  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
        intervalId.current = setInterval(getCurrentLocation, 2000);
      } else {
        setErrorMessage('위치 권한이 없습니다.');
        setLoading(false);
      }
    };

    initializeLocation();

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, []);

  const onAccept = (opponnentUserId: number) => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.sendFriendRequest(opponnentUserId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapShadowContainer}>
        <View style={styles.mapShadow}></View>
        <View style={styles.mapContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : errorMessage ? (
            <StyledText>{errorMessage}</StyledText>
          ) : (
            <MaskedView
              style={{ height: 500, width: '100%' }}
              maskElement={
                <View
                  style={{
                    backgroundColor: 'black',
                    height: 500,
                    borderRadius: 25,
                    overflow: 'hidden',
                  }}
                />
              }>
              {region ? (
                <>
                  <StyledText bold style={styles.nearbyUserList}>
                    근처 사용자 수:{' '}
                    {nearbyUsers && nearbyUsers.length ? nearbyUsers.length : 0}{' '}
                    명
                    {/* 팔콘으로부터의 거리:{' '}
                    {nearbyUsers && nearbyUsers.length
                      ? nearbyUsers[0].distance.toFixed(2)
                      : 0}
                    {'m'} */}
                  </StyledText>
                  <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    region={region}
                    customMapStyle={mapStyle}
                    style={styles.map}
                    onRegionChangeComplete={updatedRegion => {
                      setRegion(updatedRegion);
                    }}>
                    {location && (
                      <Marker
                        coordinate={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }}
                        title="현재위치"
                        icon={require('../../assets/ttubeot/mockTtu.png')}
                      />
                    )}
                  </MapView>
                </>
              ) : (
                <StyledText>현재 위치를 불러올 수 없습니다.</StyledText>
              )}
            </MaskedView>
          )}
        </View>
      </View>
      {isNfcTagged && opponentUsername !== '' && (
        <NfcTagging
          visible={isNfcTagged}
          onClose={() => {
            setIsNfcTagged(false);
          }}
          bluetoothId={opponentUsername}
          opponentUserId={opponentUserId}
          onAccept={onAccept}
        />
      )}
    </SafeAreaView>
  );
};

export default AdventureMapScreen;
