import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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
import AdventureFriendsModal from '../Friends/AdventureFriendsModal';
import { updateCoin } from '../../utils/apis/users/updateUserInfo';
import FriendRequestModal from '../Friends/FriendRequestModal';
import { isFriend } from '../../utils/apis/users/getFriendList';

// ------------------------------

// BLE 관련 모듈 추가

import BLEAdvertiser from 'react-native-ble-advertiser';
// @ts-ignore
import { SERVICE_UUID, SECRET_KEY } from '@env';

import { NativeModules, NativeEventEmitter } from 'react-native';

import BleManager, {
  BleScanMode,
  BleScanMatchMode,
  Peripheral,
  BleScanCallbackType,
} from 'react-native-ble-manager';
import { updateLog } from '../../utils/apis/updateLog';
import { profileColor } from '../ProfileImageUrl';
import useTreasureStore from '../../store/treasure';
import ParkDetailModal from './ParkDetailModal';
import { Park } from '../../types/Park';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const FriendIcon = require('../../assets/icons/FriendIcon.png');
const nearbyUsersIcon = require('../../assets/icons/nearbyUsersIcon.png');
const footPrintIcon = require('../../assets/icons/adventureFootPrint.png');
const treasureMarkerIcon = require('../../assets/icons/treasureMarker.png');

global.Buffer = require('buffer').Buffer;

// ------------------------------

interface AdventureMapScreenProps {
  steps: number;
  horseBalloonVisible: boolean;
  setHorseBalloonVisible: (horseBalloonVisible: boolean) => void;
  setHorseBalloonContent: (horseBalloonContent: string) => void;
}

interface UserProps {
  userId: number;
  distance: number;
}

const AdventureMapScreen = ({
  steps,
  horseBalloonVisible,
  setHorseBalloonVisible,
  setHorseBalloonContent,
}: AdventureMapScreenProps) => {
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const mapRef = useRef<MapView>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Interval ID 추가
  const socketRef = useRef<AdventureManager | null>(null); // AdventureManager 인스턴스 관리
  const [isConnected, setIsConnected] = useState(true); // 소켓 연결 상태 추적
  const currentSteps = useRef<number>(0);
  const [nearbyUsers, setNearbyUsers] = useState<UserProps[]>([]);
  const [veryNearbyUsers, setVeryNearbyUsers] = useState<UserProps[]>([]);
  const [isNfcTagged, setIsNfcTagged] = useState<boolean>(false);
  const [opponentUsername, setOpponentUsername] = useState<string>('');
  const [opponentUserId, setOpponentUserId] = useState<number>(-1);
  const [friendsModalVisible, setFriendsModalVisible] =
    useState<boolean>(false);
  const [isFriendRequestSent, setIsFriendRequestSent] =
    useState<boolean>(false);
  const [isFriendRequestReceived, setIsFriendRequestReceived] =
    useState<boolean>(false);
  const { accessToken, setAccessToken, ttubeotId } = useUser.getState();
  // const { hasTreasure}
  const [isFriendRequestConfirmSent, setIsFriendRequestConfirmSent] =
    useState<boolean>(false);

  // BLE 모드 관련 상태 추가
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const devicesRef = useRef<Peripheral[]>([]);

  // 렌더링과 관련 없는 상태들은 useRef로 관리
  const isScanning = useRef<boolean>(false);
  const isAdvertising = useRef<boolean>(false);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  };

  const debouncedSetDevices = useCallback(
    debounce(newDevices => {
      setDevices(newDevices);
    }, 500),
    [],
  );

  // BLE 관련 권한 요청
  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      // console.log('BleManager is started');
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
  const startScanning = async (): void => {
    if (isScanning.current === true) return;

    await stopScanning();

    isScanning.current = true;
    BleManager.scan([], 10000, true, {
      matchMode: BleScanMatchMode.Sticky,
      scanMode: BleScanMode.LowPower,
      callbackType: BleScanCallbackType.AllMatches,
    })
      .then(() => {
        // console.log('startScanning');
      })
      .catch(error => {
        // console.log('startScanning error:', error);
        isScanning.current = false;
      });
  };

  const stopScanning = async (): Promise<void> => {
    if (isScanning.current === false) return;

    try {
      await BleManager.stopScan();
      isScanning.current = false;
      // console.log('stopScanning');
    } catch (error) {
      // console.log('stopScanning error:', error);
    }
  };

  const startAdvertising = async (): Promise<void> => {
    if (isAdvertising.current === true) return;

    await stopAdvertising();

    isAdvertising.current = true;
    const { user } = useUser.getState();
    const userId = user.userId;
    const message = decimalToAscii(userId);
    const messageBytes = stringToByteArray(message);

    BLEAdvertiser.setCompanyId(0x004c);
    BLEAdvertiser.broadcast(SERVICE_UUID, messageBytes, {
      txPowerLevel: 1,
      connectable: false,
      advertiseMode: 2,
    })
      .then(() => {
        // console.log('startAdvertising');
      })
      .catch(error => {
        // console.log('startAdvertising error:', error);
      });
  };

  const stopAdvertising = async (): Promise<void> => {
    if (isAdvertising.current === false) return;

    try {
      await BLEAdvertiser.stopBroadcast();
      isAdvertising.current = false;
      // console.log('stopAdvertising');
    } catch (error) {
      // console.log('stopAdvertising error:', error);
    }
  };

  const discoverPeripheral = async (peripheral: Peripheral) => {
    if (peripheral.advertising.serviceUUIDs?.includes(SERVICE_UUID)) {
      debouncedSetDevices(prevDevices => {
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

  useEffect(() => {
    if (devicesRef.current.length === 0) return;

    const sortedDevices = [...devicesRef.current].sort(
      (a, b) => (b.rssi || -Infinity) - (a.rssi || -Infinity),
    );
  }, [devices]);

  //------------------------------

  const [remainCounts, setRemainCounts] = useState<number[]>([]);
  const [remainCount, setRemainCount] = useState<number>(0);
  const [parkList, setParkList] = useState<Park[]>([]);
  const [nearbyParkDistance, setNearbyParkDistance] = useState<number | null>(
    null,
  );
  const { setNearbyTreasure, setCurrentReward } = useTreasureStore();

  useEffect(() => {
    currentSteps.current = steps;
    // currentSteps.current = 1000;
    if (
      remainCounts.length > 0 &&
      currentSteps.current > remainCounts[0] &&
      nearbyParkDistance < 100
    ) {
      setNearbyTreasure(true);
    }
  }, [steps]);

  useEffect(() => {
    console.log(parkList);
  }, [parkList]);

  // -----------------------------

  // AdventureInfo의 싱글턴 인스턴스 가져오기
  useEffect(() => {
    if (socketRef.current === null) {
      socketRef.current = AdventureManager.getInstance();

      socketRef.current.addAdventureUserListener(data => {
        setNearbyUsers(data.users);
      });

      socketRef.current.addAdventureResultListener(data => {
        // console.log('addAdventureResultListener:', data);
        // 모험 결과 수신 시 모달 띄우기
      });

      socketRef.current.addAdventureParkListener(data => {
        // console.log('addAdventureParkListener:', data.parks);
        setParkList(data.parks);

        const nearbyPark = data.parks[0];

        setRemainCounts(nearbyPark.remainCounts);
        setRemainCount(nearbyPark.remain_count);
        setNearbyParkDistance(nearbyPark.distance);
      });

      socketRef.current.addAdventureRequestListener(data => {
        // console.log('친구 요청 수신', data);
        setOpponentUserId(data.user_id);
        setOpponentUsername(data.username);

        // 친구 요청 수신 시 모달 띄우기
        setIsNfcTagged(true);
      });

      socketRef.current.addAdventureConfirmListener(data => {
        console.log('----- 친구 요청을 수신합니다 -----', data);

        // 친구 요청 응답 수신 시 모달 닫기
        setIsNfcTagged(false);
      });

      socketRef.current.addAdventureRewardListener(data => {
        console.log('보상 정보를 수신합니다.', data);

        if (data.type === 1) {
          // 친구추가, 인사 구분하는 로직 필요
          if (data.reward > 0) {
            console.log(data);
            updateLog(accessToken, setAccessToken, 1);
            updateCoin(data.reward);
          }
        }
        if (data.type === 0) {
          if (data.reward > 0) {
            setCurrentReward(data.reward);
            setNearbyParkDistance(null);
          }
        }
      });
    }
  }, []);

  const fetchUsername = async (userId: number) => {
    try {
      const res = await getUsername(userId);
      setOpponentUsername(res);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    // console.log('useEffect nearbyUsers', nearbyUsers.length);
    // 30m 이내 사용자 필터링
    const filteredUsers = nearbyUsers.filter(user => user.distance < 30);
    setVeryNearbyUsers(filteredUsers);

    // 30m 이내 사용자 있을 경우 스캔, 광고 시작
    if (nearbyUsers.length === 0) {
      if (isScanning.current === true) {
        stopScanning();
      }

      if (isAdvertising.current === true) {
        stopAdvertising();
      }
      return;
    }

    if (!horseBalloonVisible) {
      setHorseBalloonVisible(true);
      setHorseBalloonContent('친구 발견!');

      setTimeout(() => {
        setHorseBalloonVisible(false);
        setHorseBalloonContent('');
      }, 3000);
    }

    if (isScanning.current === false) {
      startScanning();
    }

    if (isAdvertising.current === false) {
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
      // console.log(err);
      return false;
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (!isConnected || !socketRef.current) {
      // console.log('소켓이 연결되지 않아 위치 정보를 전송하지 않습니다.');
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

    socketRef.current.sendFriendRequestAccept(opponnentUserId);
    setIsFriendRequestConfirmSent(true);
    setTimeout(() => {
      setIsFriendRequestConfirmSent(false);
    }, 3000);
  };

  const requestFriend = (opponentUserId: number) => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.sendFriendRequest(opponentUserId);
    setIsFriendRequestSent(true);
    setTimeout(() => {
      setIsFriendRequestSent(false);
    }, 3000);
  };

  const [selectedPark, setSelectedPark] = useState<Park | null>(null);

  const closeParkDetailModal = () => {
    setSelectedPark(null);
  };

  const markers = useMemo(() => {
    return (
      <View>
        {location && ttubeotId !== 0 && (
          <View>
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}>
              <View style={styles.markerContainer}>
                <View style={styles.markerBackground} />
                <Image source={profileColor[ttubeotId]} style={styles.marker} />
              </View>
            </Marker>
            {parkList &&
              parkList.length > 0 &&
              parkList.map(park => {
                if (park.remain_count > 0) {
                  return (
                    <Marker
                      coordinate={{
                        latitude: park.lat,
                        longitude: park.lng,
                      }}
                      key={park.distance}
                      title={park.name}
                      icon={treasureMarkerIcon}
                      onPress={() => {
                        setSelectedPark(park);
                      }}
                    />
                  );
                }
              })}
          </View>
        )}
      </View>
    );
  }, [location]);

  const debouncedHandleRegionChange = useCallback(
    debounce(updatedRegion => {
      setRegion(updatedRegion);
    }, 2000),
    [setRegion],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapShadowContainer}>
        <View style={styles.mapShadow} />
        <View style={styles.mapContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : errorMessage ? (
            <StyledText>{errorMessage}</StyledText>
          ) : (
            <MaskedView
              style={{ height: 390, width: '100%' }}
              maskElement={
                <View
                  style={{
                    backgroundColor: 'black',
                    height: 390,
                    borderRadius: 25,
                    overflow: 'hidden',
                  }}
                />
              }>
              {region ? (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setFriendsModalVisible(true);
                    }}
                    style={styles.nearbyUsersContainer}>
                    <Image
                      source={nearbyUsersIcon}
                      style={styles.nearbyUsersIcon}
                      resizeMethod="resize"
                    />
                    <StyledText bold style={styles.nearbyUsers}>
                      {nearbyUsers && nearbyUsers.length
                        ? nearbyUsers.length.toLocaleString()
                        : 0}
                    </StyledText>
                  </TouchableOpacity>
                  <View style={styles.stepCounterContainer}>
                    <Image
                      source={footPrintIcon}
                      style={styles.stepCounterIcon}
                    />
                    <StyledText bold style={styles.stepCounter}>
                      {currentSteps.current.toLocaleString()}
                    </StyledText>
                  </View>
                  <MapView
                    key={nearbyUsers.length}
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    region={region}
                    customMapStyle={mapStyle}
                    style={styles.map}
                    onRegionChangeComplete={debouncedHandleRegionChange}>
                    {markers}
                  </MapView>
                </View>
              ) : (
                <StyledText>현재 위치를 불러올 수 없습니다.</StyledText>
              )}
            </MaskedView>
          )}
        </View>
      </View>
      <AdventureFriendsModal
        modalVisible={friendsModalVisible}
        closeFriendsModal={() => {
          setFriendsModalVisible(false);
        }}
        friends={nearbyUsers}
        requestFriend={requestFriend}
      />
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
      {isFriendRequestSent && opponentUsername !== '' && (
        <FriendRequestModal
          visible={isFriendRequestSent}
          onClose={() => {
            setIsFriendRequestSent(false);
          }}
          bluetoothId={opponentUsername}
          content1="님에게 친구 요청을 보냈어요!"
          content2="응답을 기다리는 중..."
        />
      )}
      {/* 수락 여부를 판별 */}
      {/* {isFriendRequestReceived && opponentUsername !== '' && (
        <FriendRequestModal
          visible={isFriendRequestReceived}
          onClose={() => {
            setIsFriendRequestReceived(false);
          }}
          bluetoothId={opponentUsername}
          content1="님에게 친구 요청을 보냈어요!"
          content2="응답을 기다리는 중..."
        />
      )} */}
      {isFriendRequestConfirmSent && opponentUsername !== '' && (
        <FriendRequestModal
          visible={isFriendRequestConfirmSent}
          onClose={() => {
            setIsFriendRequestConfirmSent(false);
          }}
          bluetoothId={opponentUsername}
          content1="님으로부터 친구 요청이 왔어요!"
          content2="친구 요청을 수락하셨습니다!"
        />
      )}
      {selectedPark && (
        <View style={styles.parkModalContainer}>
          <ParkDetailModal
            park={selectedPark}
            modalVisible={selectedPark !== null}
            closeModal={closeParkDetailModal}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdventureMapScreen;
