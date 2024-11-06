import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Modal, Pressable, Image } from 'react-native';
import styles from './AdventureRoute.styles';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { mapStyle } from '../../styles/mapStyle';
import MaskedView from '@react-native-masked-view/masked-view';
import StyledText from '../../styles/StyledText';

type AdventureRouteProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

type Location = {
  latitude: number;
  longitude: number;
};

const AdventureRoute = ({ modalVisible, closeModal }: AdventureRouteProps) => {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([
    { latitude: 35.0935, longitude: 128.8546 },
    { latitude: 35.0935, longitude: 128.8536 },
    { latitude: 35.0935, longitude: 128.8526 },
    { latitude: 35.0925, longitude: 128.8526 },
    { latitude: 35.0915, longitude: 128.8526 },
    { latitude: 35.0905, longitude: 128.8526 },
    { latitude: 35.0895, longitude: 128.8526 },
    { latitude: 35.0885, longitude: 128.8526 },
  ]);

  const fitMapToCoordinates = () => {
    if (mapRef.current && locations.length > 0) {
      mapRef.current.fitToCoordinates(locations, {
        edgePadding: { top: 150, right: 150, bottom: 150, left: 150 },
        animated: true,
      });
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
                  latitude: locations[0].latitude,
                  longitude: locations[0].longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.map}
                onMapReady={fitMapToCoordinates}>
                <Polyline
                  coordinates={locations}
                  strokeColor="#FF0000"
                  strokeWidth={3}
                />
                <Marker
                  coordinate={{
                    latitude: locations[0].latitude,
                    longitude: locations[0].longitude,
                  }}
                  title="시작"
                />
                <Marker
                  coordinate={{
                    latitude: locations[locations.length - 1].latitude,
                    longitude: locations[locations.length - 1].longitude,
                  }}
                  title="종료"
                />
              </MapView>
            </MaskedView>
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
