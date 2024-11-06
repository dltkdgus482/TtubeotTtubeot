import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import styles from './AdventureMapScreen.styles';
import StyledText from '../../styles/StyledText';
import { mapStyle } from '../../styles/mapStyle';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import Geolocation, {
  GeoCoordinates,
  GeoWatchOptions,
} from 'react-native-geolocation-service';
import AdventureManager from '../../utils/apis/adventure/AdventureManager';
import NfcTagging from '../NFC/NfcTagging';

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
  const [nearbyUserList, setNearbyUserList] = useState<UserProps[]>([]);
  const [isNfcTagged, setIsNfcTagged] = useState<boolean>(false);

  // -----------------------------

  useEffect(() => {
    currentSteps.current = steps;
  }, [steps]);

  // -----------------------------

  // AdventureInfo의 싱글턴 인스턴스 가져오기
  useEffect(() => {
    if (socketRef.current === null) {
      socketRef.current = AdventureManager.getInstance();

      socketRef.current.addAdventureUserListener(data => {
        // 근처 사용자 목록 수신 시 상태 업데이트
        setNearbyUserList(
          Array.isArray(data.users) && data.users.length > 0
            ? data.users
            : [
                {
                  user_id: 1,
                  username: 'test',
                  ttubeot_id: 1,
                  distance: 10,
                },
              ],
        );
      });

      socketRef.current.addAdventureResultListener(data => {
        console.log('모험 결과 수신:', data);

        // 모험 결과 수신 시 모달 띄우기
      });

      // socketRef.current.addAdventureParkListener(data => {
      // console.log('공원 정보 수신:', data);
      // 공원 목록 수신 시 지도에 마커 추가
      // });

      socketRef.current.addAdventureRequestListener(data => {
        console.log('친구 요청 수신:', data);

        // 친구 요청 수신 시 모달 띄우기
        setIsNfcTagged(true);
      });

      socketRef.current.addAdventureConfirmListener(data => {
        console.log('친구 요청 응답 수신:', data);

        // 친구 요청 응답 수신 시 모달 닫기
        setIsNfcTagged(false);
      });
    }
  }, []);

  useEffect(() => {
    // 30m 이내 다른 사용자가 있는지 판별
    if (nearbyUserList.some(user => user.distance < 30)) {
      console.log('근처에 사용자가 있습니다.');

      // BLE 스캔 시작
    } else {
      console.log('근처에 사용자가 없습니다.');
    }
  }, [nearbyUserList]);

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
        console.log('Location sent:', {
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
                    {nearbyUserList && nearbyUserList.length
                      ? nearbyUserList.length
                      : 0}{' '}
                    명
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
      {isNfcTagged && (
        <NfcTagging
          visible={isNfcTagged}
          onClose={() => {
            setIsNfcTagged(false);
          }}
          bluetoothId={'Falcon'}
        />
      )}
    </SafeAreaView>
  );
};

export default AdventureMapScreen;
