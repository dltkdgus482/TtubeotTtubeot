import React, {useState, useEffect} from 'react';
import {View, PermissionsAndroid, Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import styles from './AdventureMapScreen.styles';
import StyledText from '../../styles/StyledText';
import {mapStyle} from '../../styles/mapStyle';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';

const AdventureMapScreen = () => {
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [region, setRegion] = useState({
    latitude: 35.09,
    longitude: 128.855,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
        const {latitude, longitude} = position.coords;
        setLocation(position.coords);
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLoading(false);
      },
      error => {
        Alert.alert('위치 정보 오류', error.message);
        setErrorMessage('위치 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      } else {
        setErrorMessage('위치 권한이 없습니다.');
        setLoading(false);
      }
    };

    fetchLocation();

    const intervalId = setInterval(() => {
      getCurrentLocation();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // TODO: 로딩창 커스터마이즈

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : errorMessage ? (
          <StyledText>{errorMessage}</StyledText>
        ) : (
          <MaskedView
            style={{height: 500, width: '100%'}}
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
            <MapView
              provider={PROVIDER_GOOGLE}
              region={region}
              onRegionChangeComplete={setRegion}
              minZoomLevel={15}
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
          </MaskedView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdventureMapScreen;
