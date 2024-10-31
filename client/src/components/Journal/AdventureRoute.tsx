import React from 'react';
import { Text, View, Modal, Pressable, Image } from 'react-native';
import styles from './AdventureRoute.styles';
import Icon from 'react-native-vector-icons/AntDesign';

type AdventureRouteProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

const mapImage = require('../../assets/images/mockMap.png');

const AdventureRoute = ({ modalVisible, closeModal }: AdventureRouteProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          {/* TODO: 진짜 지도 넣어야함 */}
          <Image source={mapImage} style={styles.map} />
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
