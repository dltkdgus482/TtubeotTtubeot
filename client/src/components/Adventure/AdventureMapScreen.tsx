import React, { useState, useEffect, useRef } from 'react';
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

const AdventureMapScreen = () => {
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const mapRef = useRef<MapView>(null);
  const watchId = useRef<number | null>(null);

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
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation(position.coords);

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      },
      error => {
        Alert.alert('위치 정보 오류', error.message);
        setErrorMessage('위치 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const startWatchingLocation = () => {
    const watchOptions: GeoWatchOptions = {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
      fastestInterval: 2000,
    };

    watchId.current = Geolocation.watchPosition(
      position => {
        setLocation(position.coords);
      },
      error => {
        Alert.alert('위치 정보 오류', error.message);
        setErrorMessage('위치 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      },
      watchOptions,
    );
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
        startWatchingLocation();
      } else {
        setErrorMessage('위치 권한이 없습니다.');
        setLoading(false);
      }
    };

    initializeLocation();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // TODO: 로딩창 커스터마이즈
  // TODO: 공원 리스트

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
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  region={region}
                  customMapStyle={mapStyle}
                  style={styles.map}>
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
              ) : (
                <StyledText>현재 위치를 불러올 수 없습니다.</StyledText>
              )}
            </MaskedView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdventureMapScreen;
