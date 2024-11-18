import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Modal, Pressable, Image } from 'react-native';
import styles from './AdventureRoute.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { mapStyle } from '../../styles/mapStyle';
import MaskedView from '@react-native-masked-view/masked-view';
import StyledText from '../../styles/StyledText';
import { Location } from '../../types/Location';

type AdventureRouteProps = {
  modalVisible: boolean;
  closeModal: () => void;
  gpsLog: Location[];
};

const startIcon = require('../../assets/icons/start.png');
const finishIcon = require('../../assets/icons/finish.png');

const minLatitudeDelta = 0.005;
const minLongitudeDelta = 0.005;

const AdventureRoute = ({
  modalVisible,
  closeModal,
  gpsLog,
}: AdventureRouteProps) => {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fitMapToCoordinates = () => {
    if (mapRef.current && gpsLog.length > 0) {
      const initialRegion = {
        latitude: gpsLog[0].latitude,
        longitude: gpsLog[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      initialRegion.latitudeDelta = Math.min(
        initialRegion.latitudeDelta,
        minLatitudeDelta,
      );
      initialRegion.longitudeDelta = Math.min(
        initialRegion.longitudeDelta,
        minLongitudeDelta,
      );

      mapRef.current.fitToCoordinates(gpsLog, {
        edgePadding: { top: 150, right: 150, bottom: 150, left: 150 },
        animated: true,
      });

      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.mapContainer}>
            {gpsLog.length > 0 ? (
              <MaskedView
                style={{
                  height: '100%',
                  width: '100%',
                }}
                maskElement={
                  <View
                    style={{
                      backgroundColor: 'black',
                      height: '100%',
                      width: '100%',
                      borderRadius: 25,
                      overflow: 'hidden',
                    }}
                  />
                }>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  customMapStyle={mapStyle}
                  initialRegion={{
                    latitude: gpsLog[0].latitude,
                    longitude: gpsLog[0].longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  style={styles.map}
                  onMapReady={fitMapToCoordinates}>
                  <Polyline
                    coordinates={gpsLog}
                    strokeColor="#FF0000"
                    strokeWidth={3}
                  />
                  <Marker
                    coordinate={{
                      latitude: gpsLog[0].latitude,
                      longitude: gpsLog[0].longitude,
                    }}
                    title="시작"
                    icon={startIcon}
                  />
                  <Marker
                    coordinate={{
                      latitude: gpsLog[gpsLog.length - 1].latitude,
                      longitude: gpsLog[gpsLog.length - 1].longitude,
                    }}
                    title="종료"
                    icon={finishIcon}
                  />
                </MapView>
              </MaskedView>
            ) : (
              <View style={styles.emptyGpsLogContainer}>
                <StyledText style={styles.emptyGpsLogText}>
                  "탐험 기록이 없어요!"
                </StyledText>
                <StyledText style={styles.emptyGpsLogText}>
                  "새로운 모험을 시작해보세요!"
                </StyledText>
              </View>
            )}
          </View>
          <Icon
            name="close"
            size={30}
            color="black"
            style={styles.closeButton}
            onPress={closeModal}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AdventureRoute;
